import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table";

var statusCards = [
  {
    icon: "fa-solid fa-chess-board",
    count: "Name",
    title: "Role",
    link: "/hierarchy",
  },
  // {
  //   icon: "fa-solid fa-check",
  //   count: "0",
  //   title: "All Remaining ToDos",
  //   link: "/events",
  // },
  {
    icon: "fa-solid fa-handshake",
    count: "0",
    title: "Upcoming Meets",
    link: "/meetings",
  },
  {
    icon: "fa-solid fa-handshake",
    count: "0",
    title: "Upcoming Events",
    link: "/events",
  },
  {
    icon: "bx bx-plus-circle",
    count: "?",
    title: "Add Suggestion",
    link: "/suggest",
  },
];

const chartOptions = {
  series: [
    {
      name: "Suggestions",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
    },
    {
      name: "Complaints",
      data: [40, 30, 70, 80, 40, 16, 40, 20, 51],
    },
  ],
  options: {
    color: ["#6ab04c", "#2980b9"],
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "1st W.",
        "2nd W.",
        "3rd W.",
        "4th W.",
        "5th W.",
        "6th W.",
        "7th W.",
        "8th W.",
        "9th W.",
      ],
    },
    legend: {
      position: "top",
    },
    grid: {
      show: false,
    },
  },
};

const renderMeetingsHead = (item, index) => <th key={index}>{item}</th>;

const renderMeetingsBody = (item, index) => (
  <tr key={index}>
    <td>{item.by}</td>
    <td>{item.topic}</td>
    <td>{item.description}</td>
  </tr>
);

const renderEventsHead = (item, index) => <th key={index}>{item}</th>;

const renderEventsBody = (item, index) => (
  <tr key={index}>
    <td>{item.task}</td>
    <td>{item.description}</td>
    <td>{moment(item.duedate).format("MMMM Do YYYY, h:mm:ss a")}</td>
  </tr>
);

const Dashboard = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  const [user, setUser] = useState({});

  const [meets, setMeets] = useState("0");
  const [events, setEvents]=useState("0");
  const [allThemMeets, setAllThemMeets] = useState([]);
  const [allThemEvents, setAllThemEvents] = useState([]);
  const [showMeets, setShowMeets] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const [meetsHead] = useState(["Planned By", "Topic", "Description"]);
  const [meetsBody, setMeetsBody] = useState([]);

  const [EventsHead] = useState(["Task", "Descirption", "Due Date"]);
  const [eventssBody, setEventsBody] = useState([]);

  useEffect(() => {
    const statusCardsCreator = async () => {
      const userFind = await axios.get("/getLoginUser");
      setUser(userFind.data);
      var icon;
      var eventCount = 0;
      const allEvents = await axios.get("/event/getevents");
      setAllThemEvents(allEvents.data);
      allEvents.data.forEach((events) => {
        events.status === false &&
          userFind.data.userMail === events.userMail &&
          eventCount++;
      });
      setEvents(eventCount.toString());

      var meetCount = 0;
      const allMeets = await axios.get("/meet/getmeets");
      setAllThemMeets(allMeets.data);
      allMeets.data.forEach((meet) => {
        meet.status === false &&
          userFind.data.userName === meet.by &&
          meetCount++;
      });
      setMeets(meetCount.toString());

      if (userFind.data.userPri === 1) {
        icon = "fa-solid fa-chess-king";
      } else if (userFind.data.userPri === 2) {
        icon = "fa-solid fa-chess-queen";
      } else if (userFind.data.userPri === 3) {
        icon = "fa-solid fa-chess-rook";
      } else if (userFind.data.userPri === 4) {
        icon = "fa-solid fa-chess-knight";
      } else if (userFind.data.userPri === 5) {
        icon = "fa-solid fa-chess-pawn";
      } else {
        icon = "fa-solid fa-chess-board";
      }
      statusCards = [
        {
          icon: icon,
          count: userFind.data.userName,
          title: userFind.data.userRole,
          link: "/hierarchy",
        },
        // {
        //   icon: "fa-solid fa-check",
        //   count: eventss,
        //   title: "All Remaining ToDos",
        //   link: "/events",
        // },
        {
          icon: "fa-solid fa-handshake",
          count: meets,
          title: "Upcoming Meets",
          link: "/meetings",
        },
        {
          icon: "fa-solid fa-handshake",
          count: events,
          title: "Upcoming Event",
          link: "/Events",
        },
        {
          icon: "bx bx-plus-circle",
          count: "?",
          title: "Add Suggestion",
          link: "/suggest",
        },
      ];
    };
    statusCardsCreator();
  }, [events, meets]);

  useEffect(() => {
    const getMeets = () => {
      const tempBody = [];
      allThemMeets.forEach((meet) => {
        if (meet.by === user.userName) {
          const oneMeet = {
            by: meet.by,
            topic: meet.topic,
            description: meet.description,
          };
          tempBody.push(oneMeet);
        }
      });
      setMeetsBody(tempBody);
    };
    getMeets();
  }, [showMeets]);

  useEffect(() => {
    const getEvents = () => {
      const tempBody = [];
      allThemEvents.forEach((events) => {
        if (events.userMail === user.userMail) {
          const oneTodo = {
            id: events._id,
            task: events.task,
            description: events.description,
            status: events.status,
            duedate: events.duedate,
          };
          tempBody.push(oneTodo);
        }
      });
      setEventsBody(tempBody);
    };
    getEvents();
  }, [showEvents]);

  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6" key={index}>
                <Link to={item.link} style={{ textDecoration: "none" }}>
                  <StatusCard
                    icon={item.icon}
                    count={item.count}
                    title={item.title}
                    link={item.link}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            <Chart
              options={
                themeReducer === "theme-mode-dark"
                  ? {
                      ...chartOptions.options,
                      theme: { mode: "dark" },
                    }
                  : {
                      ...chartOptions.options,
                      theme: { mode: "light" },
                    }
              }
              series={chartOptions.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
        <div className="col-5">
          <div className="card">
            <h2>Upcoming Meetings</h2>
            <button
              className="button-primary"
              onClick={(e) => {
                e.preventDefault();
                setShowMeets(!showMeets);
              }}
            >
              {showMeets ? "Hide" : "Show"}
            </button>
            {showMeets && (
              <div>
                <div className="card__body">
                  <Table
                    headData={meetsHead}
                    renderHead={(item, index) =>
                      renderMeetingsHead(item, index)
                    }
                    bodyData={meetsBody}
                    renderBody={(item, index) =>
                      renderMeetingsBody(item, index)
                    }
                  />
                </div>
                <button className="card__footer">
                  <Link to="/meetings">View all</Link>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-7">
          <div className="card">
            <h2>Upcoming Events</h2>
            <button
              className="button-primary"
              onClick={(e) => {
                e.preventDefault();
                setShowEvents(!showEvents);
              }}
            >
              {showEvents ? "Hide" : "Show"}
            </button>
            {showEvents && (
              <div>
                <div className="card__body">
                  <Table
                    headData={EventsHead}
                    renderHead={(item, index) => renderEventsHead(item, index)}
                    bodyData={eventssBody}
                    renderBody={(item, index) => renderEventsBody(item, index)}
                  />
                </div>
                <button className="card__footer">
                  <Link to="/events">View all</Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
