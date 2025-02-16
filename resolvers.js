const Employee = require('./models/employee');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLScalarType, Kind } = require('graphql');

// Middleware to check if the user is authenticated
// This middleware verifies the JWT token passed in the Authorization header
// and returns the user object if the token is valid
const authMiddleware = async (context) => {
    const token = context.req.headers.authorization;
    console.log("Received Token:", token);

    if (!token) throw new Error("Authentication required");

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error("User not found");
        return user;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

const dateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
});

const resolvers = {
    Date: dateScalar,

    Query: {
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error("Invalid credentials");

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { user, token };
        },

        getAllEmployees: async () => {
            return await Employee.find();
        },

        getEmployeeById: async (_, { id }) => {
            const employee = await Employee.findById(id);
            if (!employee) throw new Error("Employee not found");
            return employee;
        },

        getEmployeesByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        },

        getAllUsers: async () => {
            return await User.find().select("-password");
        },
    },

    Mutation: {
        signupUser: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { user, token };
        },

        addEmployee: async (_, args, context) => {
            const user = await authMiddleware(context);
            if (!user) throw new Error("Unauthorized access");

            const employee = new Employee({
                ...args,
                created_at: new Date(),
                updated_at: new Date(),
            });

            await employee.save();
            return employee;
        },

        updateEmployee: async (_, { id, ...updateFields }, context) => {
            await authMiddleware(context);

            updateFields.updated_at = new Date();
            const employee = await Employee.findByIdAndUpdate(id, updateFields, { new: true });

            if (!employee) throw new Error("Employee not found");
            return employee;
        },

        deleteEmployee: async (_, { id }, context) => {
            await authMiddleware(context);

            const employee = await Employee.findByIdAndDelete(id);
            if (!employee) throw new Error("Employee not found");

            return "Employee deleted successfully!";
        },
    },
};

module.exports = resolvers;

