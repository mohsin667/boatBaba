import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/ModeEditOutlineRounded";
import axios from "axios";
import { Button, Pagination } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function Home() {
  const [addUser, setAddUser] = useState(false);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [data, setData] = useState([]);
  const [flashMessage, setFlasgMessage] = useState({ message: "", display: false });
  const [loading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState();
  const [toggleDrawer, setToggleDrawer] = useState(false);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    const result = await axios.get(`https://reqres.in/api/users?page=${page}`);
    setData(result.data);
    setIsLoading(true);
    console.log(result.data);
  };

  const paginate = (event, value) => {
    setPage(value);
  };

  const handleDelete = async index => {
    const res = await axios.delete(`https://reqres.in/api/users/${index}`);
    if (res.status === 204) {
      const newData = data.data.filter(user => user.id != index);
      setData({ ...data, data: newData });
      setFlasgMessage({ message: "User have been deleted", display: true });
      fuseFlashMessage();
    }
  };

  const handleEdit = index => {
    setIndex(index);
    setToggleDrawer(true);
    setAddUser(false);
  };

  if (loading === false) {
    return "Loading....";
  }

  const onInputChange = e => {
    console.log(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put(`https://reqres.in/api/users/${index}`, user).then(res => {
      if (res.status === 200) {
        const newData = data.data.map(user => {
          if (user.id == index) {
            return {
              ...user,
              ...res.data
            };
          }
          return user;
        });
        setData({ ...data, data: newData });
        setToggleDrawer(false);
        setFlasgMessage({ message: "User have been updated", display: true });
        fuseFlashMessage();
        setUser({ first_name: "", last_name: "", email: "" });
      }
    });
  };

  const { first_name, last_name, email } = user;

  const toggleSidebar = () => {
    setToggleDrawer(!toggleDrawer);
    setIndex(null);
  };

  const fuseFlashMessage = () => {
    setTimeout(() => {
      setFlasgMessage({ message: "", display: false });
    }, 2500);
  };

  const createUserSubmit = async e => {
    e.preventDefault();
    await axios.post(`https://reqres.in/api/users/`, user).then(res => {
      if (res.status === 201) {
        let newData = data.data;
        newData.push(res.data);
        setData({ ...data, data: newData });
        setToggleDrawer(false);
        setFlasgMessage({ message: "A new User have been added", display: true });
        fuseFlashMessage();
        setUser({ first_name: "", last_name: "", email: "" });
      }
    });
  };

  const createUser = async () => {
    setToggleDrawer(!toggleDrawer);
    setAddUser(!addUser);
  };

  console.log();
  return (
    <>
      <Container maxWidth="lg">
        <Box className="mainBox">
          {flashMessage.display ? (
            <div className="alert alert-success" role="alert">
              {flashMessage.message}
            </div>
          ) : null}
        </Box>

        <Button onClick={createUser} className="mx-4 mt-3 btn btn-sm btn-primary" variant="contained" endIcon={<PersonAddIcon />}>
          Add
        </Button>

        <Box className="mainBox">
          {data.data.map(users => (
            <Box key={users.id} className="boxWrapper" sx={{ padding: "10px", background: "white", boxShadow: 1, display: "flex", alignItems: "center" }}>
              <Avatar className="avatar" src={users.avatar} />
              <Box className="details-container">
                <Box className="actions">
                  <Delete onClick={() => handleDelete(users.id)} />
                  <Edit onClick={() => handleEdit(users.id)} />
                </Box>
                <Box className="text-row">
                  <PersonIcon />
                  {users.first_name} {users.last_name}
                </Box>
                <Box className="text-row">
                  <AlternateEmailIcon />
                  {users.email}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Pagination onChange={paginate} count={data.total_pages} />
        <div className={`drawer shadow ${toggleDrawer ? "openDrawer" : ""}`}>
          <HighlightOffIcon onClick={toggleSidebar} />
          <form>
            <input required className="form-control my-2" onChange={e => onInputChange(e)} value={first_name} name="first_name" type="text" placeholder="update first name" />
            <input required className="form-control my-2" onChange={e => onInputChange(e)} value={last_name} name="last_name" type="text" placeholder="update last name" />
            <input required className="form-control my-2" onChange={e => onInputChange(e)} value={email} name="email" type="email" placeholder="update the memeber email" />
            {addUser ? (
              <button className="btn btn-small btn-primary" onClick={e => createUserSubmit(e)} type="submit">
                Create User
              </button>
            ) : (
              <button className="btn btn-small btn-primary" onClick={e => handleSubmit(e)} type="submit">
                Update
              </button>
            )}
          </form>
        </div>
      </Container>
    </>
  );
}

export default Home;
