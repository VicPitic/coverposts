import {
   Briefcase,
   ListTask,
   People,
   Bullseye
} from 'react-bootstrap-icons';

export const ProjectsStats = [
   {
      id: 1,
      title: "Post generated",
      value: 18,
      icon: <Briefcase size={18} />,
   },
   {
      id: 2,
      title: "Blog URLs used",
      value: 132,
      icon: <ListTask size={18} />,
   },
   {
      id: 3,
      title: "Remaining Credits",
      value: 12,
      icon: <People size={18} />,
   },
   {
      id: 4,
      title: "Productivity",
      value: '76%',
      icon: <Bullseye size={18} />,
   }
];
export default ProjectsStats;
