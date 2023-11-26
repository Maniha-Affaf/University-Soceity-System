import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { Checkbox } from "@mui/material";
import ReactDOM from "react-dom";
import axios from "axios";

import Table from "../components/table/Table";

const Meetings = () => {
  const [head] = useState([
    "Planned By",
    "Topic",
    "Description",
    "Start Time",
    "End Time",
    "Meet Type",
    "Status",
  ]);
  const [body, setBody] = useState([]);
  const [user, setUser] = useState({});
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const status = false;
  const [stime, setStime] = useState("");
  const [etime, setEtime] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [meetType, setMeetType] = useState("");

  const handleMeetTypeChange = async (event) => {
    setMeetType(event.target.value);
  };

  useEffect(() => {
    const loginUser = async () => {
      setUser(await axios.get("/getLoginUser"));
    };
    loginUser();

    getMeets();
  }, [show]);

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const [isModalOpen, setModalOpen] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    id: "",
    by: "",
    topic: "",
    description: "",
    meetType: "",
    stime: "",
    etime: "",
  });

  const handleEdit = () => {
    // Perform your edit logic here
    // For example, you can call your updateMeet function
    updateMeet(
      editedDetails.id,
      editedDetails.status,
      editedDetails.topic,
      editedDetails.description,
      editedDetails.meetType,
      editedDetails.stime,
      editedDetails.etime
    );

    // Close the modal after editing
    closeModal();
  };

  const renderAllBody = (item, index) => (
    <tr key={index}>
      <td>{item.by}</td>
      <td>{item.topic}</td>
      <td>{item.description}</td>
      <td>{moment(item.stime).format("MMMM Do YYYY, h:mm:ss a")}</td>
      <td>{moment(item.etime).format("MMMM Do YYYY, h:mm:ss a")}</td>
      <td>{item.meetType}</td>
      <td>
        <Checkbox
          checked={item.status && true}
          onChange={(e) => {
            e.preventDefault();
            updateMeet(
              item.id,
              item.status,
              item.topic,
              item.description,
              item.meetType,
              item.stime,
              item.etime
            );
            item.status = !item.status;
          }}
        />
      </td>
      <td>
        <button
          onClick={(e) => {
            console.log("button clicked");
            e.preventDefault();

            openModal(
              item.id,
              item.status,
              item.topic,
              item.description,
              item.meetType,
              item.stime,
              item.etime
            );
          }}
        >
          EDIT
        </button>
      </td>
    </tr>
  );

  const openModal = (
    id,
    status,
    topic,
    description,
    meetType,
    stime,
    etime
  ) => {
    setEditedDetails({
      id,
      status,
      topic,
      description,
      meetType,
      stime,
      etime,
    });
    setModalOpen(true);
    console.log("Modal opened"); // Add this line
  };

  const closeModal = () => {
    setModalOpen(false);
    console.log("Modal closed"); // Add this line
  };

  const updateMeet = async (
    id,
    status,
    topic,
    description,
    meetType,
    stime,
    etime
  ) => {
    await axios.put("/meet/updatemeet", {
      id: id,
      status: status,
      topic: topic,
      description: description,
      meetType: meetType,
      starttime: stime,
      endtime: etime,
    });
    getMeets();
  };

  const getMeets = async () => {
    const tempBody = [];
    const { data } = await axios.get("/meet/getmeets");
    data?.forEach((meet) => {
      const oneMeet = {
        id: meet._id,
        by: meet.by,
        topic: meet.topic,
        description: meet.description,
        stime: meet.stime,
        etime: meet.etime,
        status: meet.status,
        meetType: meet.meetType,
      };
      tempBody.push(oneMeet);
      // }
    });
    setBody(tempBody);
  };
  const pushMeet = async (
    by,
    topic,
    description,
    stime,
    etime,
    status,
    meetType
  ) => {
    console.log(meetType);
    const data = await axios.post("/meet/addmeet", {
      by: by,
      topic: topic,
      description: description,
      stime: stime,
      etime: etime,
      status: status,
      meetType: meetType,
    });
    setError(data.data.message);
  };

  return (
    <div className="Meeting">
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <label>
              Topic:
              <input
                type="text"
                value={editedDetails.topic}
                onChange={(e) =>
                  setEditedDetails({ ...editedDetails, topic: e.target.value })
                }
              />
            </label>

            <label>
              Description:
              <input
                type="text"
                value={editedDetails.description}
                onChange={(e) =>
                  setEditedDetails({
                    ...editedDetails,
                    description: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Meet Type:
              <input
                type="text"
                value={editedDetails.meetType}
                onChange={(e) =>
                  setEditedDetails({
                    ...editedDetails,
                    meetType: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Start Time:
              <input
                type="text"
                value={editedDetails.stime}
                onChange={(e) =>
                  setEditedDetails({ ...editedDetails, stime: e.target.value })
                }
              />
            </label>

            <label>
              End Time:
              <input
                type="text"
                value={editedDetails.etime}
                onChange={(e) =>
                  setEditedDetails({ ...editedDetails, etime: e.target.value })
                }
              />
            </label>

            <button onClick={handleEdit}>Save Changes</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
      ;<h2>Meetings</h2>
      <br></br>
      <br></br>
      <div className="card">
        <h2>All Meetings</h2>
        <br></br>
        <div className="card">
          <button
            className="button-primary"
            onClick={(e) => {
              e.preventDefault();
              setShow(!show);
              setError("");
            }}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {show && (
          <div className="card">
            <div className="card__body">
              <Table
                headData={head}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={body}
                renderBody={(item, index) => renderAllBody(item, index)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="card">
        <h2>Schedule A Meeting</h2>
        <br></br>
        <br></br>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <label>
                <b>Topic: </b>
              </label>
              <input
                onChange={(e) => {
                  setTopic(e.target.value);
                  setError("");
                }}
                type="text"
              />
            </div>
            <div className="col-6">
              <label>
                <b>Description: </b>
              </label>
              <input
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError("");
                }}
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="inputs">
                <h3>Select a Date!</h3>
                <br></br>
                <Calendar value={date} onChange={setDate} />
                <p>
                  Current selected date is{" "}
                  <b>{moment(date).format("MMMM Do YYYY")}</b>
                </p>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <h3>Select a Time!</h3>
                  <br></br>
                  <form>
                    <label htmlFor="stime">Starting Time:</label>
                    <input
                      type="time"
                      onChange={(e) => {
                        setStime(e.target.value);
                        setError("");
                      }}
                      id="stime"
                      name="stime"
                    />

                    <label htmlFor="etime">Ending Time:</label>
                    <input
                      type="time"
                      onChange={(e) => {
                        setEtime(e.target.value);
                        setError("");
                      }}
                      id="etime"
                      name="etime"
                    />
                  </form>
                </div>
              </div>
              <div className="col-12">
                <div className="card">
                  <h3>Select Meeting Type</h3>
                  <br />
                  <form>
                    <label htmlFor="meetingType">Choose a meeting type:</label>
                    <select
                      onChange={handleMeetTypeChange}
                      id="meetingType"
                      name="meetingType"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="online">Online</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="button-primary"
          onClick={(e) => {
            e.preventDefault();
            if (topic === "" || description === "") {
              if (topic === "") {
                setError("Topic Can't be empty!");
              } else if (description === "") {
                setError("Description Can't be empty!");
              } else {
                setError("Something went Wrong!");
              }
            } else {
              try {
                const sdatetime = new Date(date);
                const edatetime = new Date(date);
                sdatetime.setHours(
                  parseInt(stime.slice(0, 2)),
                  parseInt(stime.slice(3, 5))
                );
                edatetime.setHours(
                  parseInt(etime.slice(0, 2)),
                  parseInt(etime.slice(3, 5))
                );
                try {
                  pushMeet(
                    user.data.userMail,
                    topic,
                    description,
                    sdatetime.toISOString(),
                    edatetime.toISOString(),
                    status,
                    meetType
                  );
                } catch {
                  setError("Something went Wrong!");
                }
              } catch {
                setError("Please Enter Date and Time Correctly!");
              }
            }
          }}
        >
          Add
        </button>
        {(() => {
          if (error === "") {
            return <></>;
          } else if (error === "New Meeting Created!") {
            return (
              <div className="isa_success">
                <i className="fa-solid fa-thumbs-up"></i>
                {error}
              </div>
            );
          } else if (error === "Something went Wrong!") {
            return (
              <div className="isa_error">
                <i className="fa-solid fa-bomb"></i>
                {error}
              </div>
            );
          } else {
            return (
              <div className="isa_warning">
                <i className="fa-solid fa-explosion"></i>
                {error}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};
export default Meetings;
