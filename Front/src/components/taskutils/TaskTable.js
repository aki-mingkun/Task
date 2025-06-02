import { motion } from 'framer-motion';
import moment from 'moment';

const TaskTable = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-900">
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Priority
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <motion.tr
              key={task.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {task.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {task.due_date
                  ? moment(task.due_date).format('Do MMMM YYYY')
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{task.priority}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default TaskTable;
