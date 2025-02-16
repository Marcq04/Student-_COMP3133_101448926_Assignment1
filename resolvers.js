const Employee = require('./models/model');

const resolvers = {
    Query: {
        getAllEmployees: async () => await Employee.find(),
        getEmployeeById: async (_, { id }) => await Employee.findById(id),
    },
    Mutation: {
        addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
            const employee = new Employee({ first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo });
            await employee.save();
            return employee;
        },
        addEmployeesBulk: async (_, { employees }) => {
            const result = await Employee.insertMany(employees);
            return result;
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