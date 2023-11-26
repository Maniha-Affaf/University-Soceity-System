import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { Checkbox } from "@mui/material";
import axios from "axios";

import Table from "../components/table/Table";



const Events = () => {
  const [head] = useState([
    "Planned By",
    "Topic",
    "Description",
    "Start Time",
    "End Time",
    "Event Type",
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
  const [eventType,setEventType]=useState("");


  const handleEventTypeChange = async (event) => {
    setEventType(event.target.value);
  };



  useEffect(() => {
    const loginUser = async () => {
      setUser(await axios.get("/getLoginUser"));
    };
    loginUser();

     
    getEvents();
  }, [show]);
  const updateEvent = async (id, status) => {
    await axios.put("/event/updateevent", {
      id: id,
      status: status,
    });
    getEvents();
  };
  
  const renderHead = (item, index) => <th key={index}>{item}</th>;
  
  const renderAllBody = (item, index) => (
    <tr key={index}>
      <td>{item.by}</td>
      <td>{item.topic}</td>
      <td>{item.description}</td>
      <td>{moment(item.stime).format("MMMM Do YYYY, h:mm:ss a")}</td>
      <td>{moment(item.etime).format("MMMM Do YYYY, h:mm:ss a")}</td>
      <td>{item.eventType}</td>
      <td>
        <Checkbox
          checked={item.status && true}
          onChange={(e) => {
            e.preventDefault();
            updateEvent(item.id, item.status);
            item.status = !item.status;
          }}
        />
      </td>
    </tr>
  );
  
    const getEvents = async () => {
      const tempBody = [];
      const { data } = await axios.get("/event/getevents");
      data?.forEach((event) => {
        // if (event.by === user?.data?.userName) {
          const oneEvent = {
            id: event._id,
            by: event.by,
            topic: event.topic,
            description: event.description,
            stime: event.stime,
            etime: event.etime,
            eventType:event.eventType,
            status: event.status,
          };
          tempBody.push(oneEvent);
        // }
      });
      setBody(tempBody);
    };

 

  const pushEvent = async (by, topic, description, stime, etime, status) => {
    const data = await axios.post("/event/addevent", {
      by: by,
      topic: topic,
      description: description,
      stime: stime,
      etime: etime,
      eventType:eventType,
      status: status,
    });
    setError(data.data.message);
  };

  return (
    <div className="Meeting">
      <h2>Events</h2>
      <br></br>
      <br></br>
      <div className="card">
        <h2>All Events</h2>
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
        <h2>Schedule An Event</h2>
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
          <div className="col-9">
            <div className="card">
              <div className="inputs">
                <h3>Select a Date!</h3>
                <br></br>
                <Calendar value={date} onChange={setDate} />
                <p>
                  Current selected date is
                  <b>{moment(date).format("MMMM Do YYYY")}</b>
                </p>
              </div>
            </div>
          </div>
          <div className="col-3 row">
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
         <div className="col-12">
            <div className="card">
              <h3>Select Event Type</h3>
              <br />
              <form>
                <label htmlFor="eventType">Choose an Event type:</label>
                <select onChange={handleEventTypeChange} id="eventType" name="eventType">
                  <option value="Seminar">Seminar</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Annual dinner">Annual Dinner</option>
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
                  pushEvent(
                    user.data.userMail,
                    topic,
                    description,
                    sdatetime.toISOString(),
                    edatetime.toISOString(),
                    status
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
          } else if (error === "New Event Created!") {
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
export default Events;
