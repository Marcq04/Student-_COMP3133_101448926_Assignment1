const Employee = require('./models/employee');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error("Invalid credentials");

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { user, token };
        },
        getAllEmployees: async () => await Employee.find(),
        getEmployeeById: async (_, { id }) => await Employee.findById(id),
        getEmployeesByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;
            return await Employee.find(query);
        },
    },
    Mutation: {
        signupUser: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { user, token };
        },
        addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
            const employee = new Employee({ first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo });
            await employee.save();
            return employee;
        },
        updateEmployee: async (_, { id, first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
            return await Employee.findByIdAndUpdate(id, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }, { new: true });
        },
        deleteEmployee: async (_, { id }) => {
            await Employee.findByIdAndDelete(id);
            return "Employee deleted successfully!";
        }
    }
};

module.exports = resolvers;
