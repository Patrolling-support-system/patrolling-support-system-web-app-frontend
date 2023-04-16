import { useParams } from "react-router-dom";


export function TaskDetails() {

    const {taskId} = useParams();
      return (
    <div className="App">
        taskId: {taskId}
    </div>
  );
}