import "./AttendenceTable.css";
import Table from "react-bootstrap/Table";

const AttendenceTable = ({ attendence }) => {
  return (
    <div className="table_container">
      <Table hover variant="dark" className="attendence_table rounded">
        <thead>
          <tr>
            <th style={{ width: "25%" }}>Date</th>
            <th style={{ width: "25%" }}>Day of the week</th>
            <th style={{ width: "25%" }}>Attendence</th>
            <th style={{ width: "25%" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendence &&
            attendence.map((record) => (
              <tr key={record._id}>
                <td>{record.date}</td>
                <td>{record.day}</td>
                <td>{record.requestType}</td>
                <td>{record.status}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AttendenceTable;
