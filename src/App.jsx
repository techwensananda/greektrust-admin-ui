
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, InputGroup, Pagination, Row } from 'react-bootstrap';
import './App.css';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { BiEdit } from 'react-icons/bi';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

function App() {
  const [finalllUsers, setfinalllUsers] = useState([])
  const [allUsers, setallUsers] = useState([])
  const [users, setUsers] = useState([])
  const [pages, setpages] = useState([])
  const [selectedPages, setselectedPages] = useState(1)
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [userInfos, setuserInfos] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [query, setQuery] = useState("");
  const keys = ["name", "email", "role"];
 
  const searchUsers = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query))
    );
  };

  useEffect(() => {
    const getusers = async () => {
      setloading(true)
      await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(res => {
          if (res.status == 200) {
            setallUsers(res.data)
            setfinalllUsers(res.data)
            setloading(false)
          }

        }).catch(err => {
          setloading(false)

        })
    }
    getusers()
  }, [])


  useEffect(() => {
    const length = Math.ceil(allUsers.length / 10);
 
    setpages(Array.from({ length: length }, (_, i) => i + 1))
    if (users.length == 0) {
      setselectedPages(1)
    }
  }, [users])

  useEffect(() => {
    let skip = 10;
    if (selectedPages == 1) {

      setUsers(allUsers.slice(0, skip))
    } else {

      skip = selectedPages * 10
      setUsers(allUsers.slice(skip - 10, skip))
    }

  }, [selectedPages, allUsers])

  const confirmModalAction = () => {

    if (userInfos.editUser) {
      setallUsers(allUsers.map(user => user.id == userInfos.id ? userInfos : user))
      setuserInfos({})
    } else {

      if (Array.isArray(userInfos)) {
        setallUsers(allUsers.filter(user => user.isChecked !== true))

        if (users.length == 1) {
          setselectedPages(selectedPages == 1 ? 1 : selectedPages - 1)
        }
      } else {
        setallUsers(allUsers.filter(user => user.id !== userInfos.id))
        setuserInfos({})

        if (users.length == 1) {
          setselectedPages(selectedPages == 1 ? 1 : selectedPages - 1)
        }
      }


    }



  }
  
  const handleChange = (event, index) => {
    const { name, checked } = event.target;

    if (name == "all") {
      const selectedId = users.map((user) => (user.id))
    

      setallUsers(allUsers.map((user) => {
        delete user.isChecked
      }))
      setallUsers(allUsers.map((user) => {
        return selectedId.includes(user.id) ? { ...user, isChecked: checked } : user
      }))
      // const yy = users.map((user) => ({ ...user, isChecked: checked }))

      // const updateUser = allUsers.filter(us=> yy.includes(us.id))

    } else {

      setallUsers(allUsers.map((user) => user.id == name ? { ...user, isChecked: checked } : user))
    }


  };

  const handlePageChange = (pagenum) => {
   
    if (pagenum === "prev") {
      setselectedPages(selectedPages == 1 ? 1 : selectedPages - 1)

    }
    else if (pagenum === "next") {
      setselectedPages(selectedPages + 1)

    }
    else {
      setselectedPages(pagenum)
    }



  }

  const handleEdit = (id) => {

  }

  useEffect(() => {
    setallUsers(searchUsers(finalllUsers))

    setselectedPages(1)

  }, [query])
  const deleteMultiple = () => {
    setallUsers(allUsers.filter(user => user.isChecked !== true))

    if (users.length == 1) {
      setselectedPages(selectedPages == 1 ? 1 : selectedPages - 1)
    }
  }

  return (
    <Container className='mt-2'>


      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search user"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={() => searchUsers(finalllUsers)}>
          Search
        </Button>
      </InputGroup>
    
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input type="checkbox" name='all' checked={users.filter(user => user.isChecked !== true).length < 1} onChange={(e) => handleChange(e, "all")} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className='text-center'> Actions</th>
          </tr>
        </thead>

        <tbody>



          {
            users.length !== 0 && users.map((user, ind) => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox" checked={user.isChecked} name={user.id} onChange={(e) => handleChange(e, user.id)} />
                </td>
                <td>{user.name}  </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className='cursor-pointer d-flex justify-content-evenly'> <Button variant="danger" size="sm" onClick={() => {
                  setuserInfos(user)
                  handleShow()
                }}> <RiDeleteBin5Line />      </Button>
                  <Button variant="success" size="sm" onClick={() => {
                    setuserInfos({ ...user, editUser: true })
                    handleShow()
                  }}>   <BiEdit />     </Button></td>
              </tr>

            ))
          }
          {loading && <tr >
            <td>
              <Placeholder.Button variant="primary" xs={6} />
            </td>
            <td>   <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={12} />
            </Placeholder> </td>
            <td>   <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={12} />
            </Placeholder> </td>
            <td>   <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={12} />
            </Placeholder> </td>


            <td className='cursor-pointer d-flex justify-content-evenly'>   <Placeholder.Button variant="primary" xs={4} />
              <Placeholder.Button variant="primary" xs={4} /></td>
          </tr>}

        </tbody>
      </Table>



      <Row>

        {
          allUsers.filter(user => user.isChecked == true).length >= 1 && <Col >
            <Button variant="danger" onClick={() => {
              setuserInfos(allUsers.filter(user => user.isChecked == true))
              handleShow()
            }}>Delete</Button>
          </Col>}
        <Col>
          <Pagination>
            <Pagination.First disabled={selectedPages == 1} onClick={() => handlePageChange("prev")} />

            {
              pages.map((page, ind) => (


                <Pagination.Item key={ind} onClick={() => handlePageChange(page)} active={selectedPages == page} >{page}</Pagination.Item>
              ))
            }





            <Pagination.Last disabled={selectedPages == pages.length} onClick={() => handlePageChange("next")} />
          </Pagination>
        </Col>
      </Row>



      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>  {Array.isArray(userInfos) ? `${userInfos.length} users` : `${userInfos.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {userInfos.editUser ?
          <>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                className='me-2'
                value={userInfos.name}
                onChange={(e) => setuserInfos({ ...userInfos, name: e.target.value })}
              />
              <Form.Control
                placeholder="Recipient's Email"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                className='ms-2'
                value={userInfos.email}
                onChange={(e) => setuserInfos({ ...userInfos, email: e.target.value })}
              />

            </InputGroup>

            <Form>
              <Form.Check
                type="switch"
                id="custom-switch"
                label={userInfos.role}
                value={userInfos.role}
                onChange={(e) => setuserInfos({ ...userInfos, role: e.target.checked ? "admin" : "member" })}
              />
            </Form>
          </>
          : ` Are you sure to delete ${Array.isArray(userInfos) ? userInfos.length + " " + "users" : userInfos.name} ?`}   </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            confirmModalAction()
            handleClose()
          }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


    </Container >
  );
}

export default App;
