import { useState, useEffect, useRef } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'

function CalendarDays(props) {
      const[drop,setdrop]=useState(false)
      const [show1, setShow1] = useState(false)
      const dragItem = useRef();
      const dragOverItem = useRef();
      const [validated, setValidated] = useState(false);
      const [show, setShow] = useState(false)
      const [selected, setSelected] = useState(null)
      const [details, setDetails] = useState(null)
      const [myAppoints, setMyappoint] = useState(null)
      let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
      let weekdayOfFirstDay = firstDayOfMonth.getDay();
      let currentDays = [];
      for (let day = 0; day < 42; day++) {
            if (day === 0 && weekdayOfFirstDay === 0) {
                  firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
            } else if (day === 0) {
                  firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
            } else {
                  firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
            }

            let calendarDay = {
                  currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
                  date: (new Date(firstDayOfMonth)),
                  month: firstDayOfMonth.getMonth(),
                  number: firstDayOfMonth.getDate(),
                  selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
                  year: firstDayOfMonth.getFullYear(),
            }

            currentDays.push(calendarDay);
      }
   
     
      useEffect(() => {
            axios.post("https://calendar-mjzv.onrender.com/")
                  .then(res => setMyappoint(res.data.Data))
                  .catch(err => console.log(err))
      }, [props.day, show1,show,drop])

      //To Add New AppointMents
      const Add = () => {
            let match = currentDays.find(item => item.selected)
            if(!myAppoints){
                  setShow(true)
            }
            myAppoints && myAppoints.find(item => item.Date === match.number + "/" + (Number(match.month + 1)) + "/" + match.year ? setShow1(true) : setShow(true))
            setSelected(match)
      }

      const handleSubmit = (event) => {
            event.preventDefault()
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
            }
            else {
                  let obj = {
                        FullName: event.target[0].value,
                        Date: selected.number + "/" + (Number(selected.month + 1)) + "/" + selected.year,
                        Time: event.target[1].value,
                        Address: {
                              Address1: event.target[2].value,
                              Address2: event.target[3].value,
                              City: event.target[4].value,
                              State: event.target[5].value,
                              ZipCode: event.target[6].value,
                        }
                  }
                  axios.post("https://calendar-mjzv.onrender.com/", obj)
                        .then(res => setShow(false))
                        .catch(err => console.log(err))

            }

            setValidated(true);
      };

      //Drag the appointment
      const dragStart = (e, position) => {
            dragItem.current = position;
      };

      const dragEnter = (e, position) => {
            dragOverItem.current = position;
      };
      const View = (date) => {
            let find = myAppoints.find((item) => item.Date === date)
            setDetails(find)
            setShow1(true)
      }
      const Drop = (ind) => {
            let obj = {
                  prevdate: dragItem.current,
                  update: dragOverItem.current
            }
            axios.post("https://calendar-mjzv.onrender.com/", obj)
                  .then((res) => setdrop(!drop))
                  .catch(err => console.log(err))
      }
      //Delete
      const Delete = (date) => {
            let obj = {
                  delete: date
            }
            axios.post("https://calendar-mjzv.onrender.com/", obj)
                  .then((res) => setShow1(false))
                  .catch(err => console.log(err))
      }


      return (
            <div className="table-content">
                  {
                        currentDays.map((day, index) => {
                              return (
                                    <div className={"calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "")}
                                          onClick={() => props.changeCurrentDay(day)} key={index} onDragEnter={(e) => dragEnter(e, day.number + "/" + (Number(day.month + 1)) + "/" + day.year)} onDragEnd={() => Drop()}>
                                          <p >{day.number}</p>
                                          {day.selected && <p style={{ paddingTop: "30px", marginRight: "70px", fontSize: "30px" }} onClick={() => Add()}>➕</p>}
                                          {myAppoints && myAppoints.map((item, ind) =>
                                                <div key={ind}>
                                                      {day.number + "/" + (Number(day.month + 1)) + "/" + day.year === item.Date && <p style={{ paddingTop: "30px", fontSize: "30px" }} onDragStart={(e) => dragStart(e, item.Date)} onClick={() => View(item.Date)} draggable>❗</p>}
                                                     
                                                </div>
                                          )}
                                    </div>
                              )
                        })
                  }
                  <Modal
                        show={show}
                        onHide={() => setShow(false)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                  >
                        <Modal.Header closeButton>
                              <Modal.Title id="contained-modal-title-vcenter">
                                    Add new Appointment
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <Form noValidate validated={validated} onSubmit={handleSubmit} >
                                    <Row className="mb-3">
                                          <Form.Group as={Col} >
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control type="text" placeholder="With whom" required />
                                                <Form.Control.Feedback type="invalid">
                                                      Please enter full name!
                                                </Form.Control.Feedback>
                                          </Form.Group>

                                          <Form.Group as={Col} >
                                                <Row>
                                                      <Form.Label as={Col}>Date:{selected && selected.number + "/" + (Number(selected.month + 1) + "/" + selected.year)}</Form.Label>
                                                      <Col>
                                                            <Form.Label as={Col}>Time:</Form.Label>
                                                            <Form.Control type="time" required></Form.Control>
                                                            <Form.Control.Feedback type="invalid">
                                                                  Please enter full name!
                                                            </Form.Control.Feedback>
                                                      </Col>
                                                </Row>

                                          </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" >
                                          <Form.Label>Address</Form.Label>
                                          <Form.Control placeholder="Address" required />
                                          <Form.Control.Feedback type="invalid">
                                                Please enter Address!
                                          </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" >
                                          <Form.Label>Address 2</Form.Label>
                                          <Form.Control placeholder="Apartment, studio, or floor" required />
                                          <Form.Control.Feedback type="invalid">
                                                Please enter Address2!
                                          </Form.Control.Feedback>
                                    </Form.Group>

                                    <Row className="mb-3">
                                          <Form.Group as={Col} >
                                                <Form.Label>City</Form.Label>
                                                <Form.Control required />
                                                <Form.Control.Feedback type="invalid">
                                                      Please enter city!!
                                                </Form.Control.Feedback>
                                          </Form.Group>

                                          <Form.Group as={Col} >
                                                <Form.Label>State</Form.Label>
                                                <Form.Control required />
                                                <Form.Control.Feedback type="invalid">
                                                      Please enter state!
                                                </Form.Control.Feedback>
                                          </Form.Group>

                                          <Form.Group as={Col}>
                                                <Form.Label>Zip</Form.Label>
                                                <Form.Control type="number" minLength={6} maxLength={6} required />
                                                <Form.Control.Feedback type="invalid">
                                                      Please enter valid ZipCode!
                                                </Form.Control.Feedback>
                                          </Form.Group>
                                    </Row>



                                    <Button variant="primary" type="submit">
                                          Submit
                                    </Button>
                              </Form>
                        </Modal.Body>

                  </Modal>
                  <Modal
                        show={show1}
                        onHide={() => setShow1(false)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                  >
                        <Modal.Header closeButton>
                              <Modal.Title id="contained-modal-title-vcenter">
                                    Appointment Detail
                              </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <Form >
                                    <Row className="mb-3">
                                          <Form.Group as={Col} >
                                                <Form.Label>Full Name : {details && details.FullName}</Form.Label>

                                          </Form.Group>

                                          <Form.Group as={Col} >
                                                <Row>
                                                      <Form.Label as={Col}>Date:{details && details.Date}</Form.Label>
                                                      <Col>
                                                            <Form.Label as={Col}>Time:{details && details.Time}</Form.Label>
                                                      </Col>
                                                </Row>
                                          </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" >
                                          <Form.Label>Address :  {details && details.Address.Address1}, {details && details.Address.Address2},
                                                {details && details.Address.City}, {details && details.Address.State}-{details && details.Address.ZipCode}
                                          </Form.Label>

                                    </Form.Group>

                              </Form>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="danger" type="submit" onClick={() => Delete(details.Date)}>
                                    Delete
                              </Button>
                              <Button variant="primary" type="submit" onClick={() => setShow1(false)}>
                                    Ok
                              </Button>
                        </Modal.Footer>

                  </Modal>
            </div>
      )
}

export default CalendarDays;
