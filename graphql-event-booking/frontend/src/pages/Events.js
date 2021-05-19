import React, { useState, useContext, useEffect } from "react";
import Modal from "./../components/Modal/Modal";
import Backdrop from "./../components/Backdrop/Backdrop";
import authContext from "./../context/AuthContext";
import EventList from "./../components/Events/EventList";
import Spinner from "./../components/Spinner/Spinner";
import "./Events.css";
export default function Events() {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState("");
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const { token, userId } = useContext(authContext);
  const [isActive, setIsActive] = useState(true);
  const startCreateEventHandler = () => {
    setCreating(true);
  };

  useEffect(() => {
    fetchEvents();
    return () => {
      setIsActive(false);
    };
  }, []);
  const fetchEvents = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (isActive) {
          setEvent(resData.data.events);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (isActive) {
          setLoading(false);
        }
      });
  };
  const modalConfirmHandler = (e) => {
    e.preventDefault();
    setCreating(false);
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price: +price, date, description };
    console.log(event);
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
    };
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedEvents = {
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: userId,
          },
        };
        setEvent((current) => [...current, updatedEvents]);
        return event;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent("");
  };
  const showDetailHandler = (eventId) => {
    const detail = event.find((e) => e._id === eventId);

    setSelectedEvent(detail);
  };
  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent("");
      return;
    }
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${selectedEvent._id}") {
              _id
             createdAt
             updatedAt
            }
          }
        `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}

      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          confirmText="Confirm"
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
              />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={token ? "Book" : "Please login to book event"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {token && (
        <div className="events-control">
          <p>Share your own Events</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <EventList
          events={event}
          authUserId={userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
}
