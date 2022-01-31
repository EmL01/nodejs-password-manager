import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URI = 'https://one-pass156165.herokuapp.com'

function App() {
  const [passwords, setPasswords] = useState([])
  const [services, setServices] = useState([])
  const [newService, setNewService] = useState('')
  const [service, setService] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)

  const getPasswords = async () => {
    const res = await axios.get(`${API_URI}/passwords`)
    setPasswords(res.data)
  }
  const getServices = async () => {
    const res = await axios.get(`${API_URI}/services`)
    setServices(res.data)
  }

  useEffect(() => {
    getPasswords()
    getServices()
  }, [])

  const copyPassword = (value) => {
    navigator.clipboard.writeText(value)
  }

  const deletePassword = async _id => {
    const res = await axios.delete(`${API_URI}/passwords/${_id}`)
    setMessage(res.data.msg)
    setTimeout(() => {
      setMessage(null)
    }, 5000);
    getPasswords()
  }

  const onNewService = async e => {
    e.preventDefault()
    if(newService !== '') {
      const res = await axios.post(`${API_URI}/services`, { service: { name: newService } })
      setNewService('')
      setMessage(res.data.msg)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
      getServices()
    }
  }

  const onNewPassword = async e => {
    e.preventDefault()
    if(service !== '') {
      const res = await axios.post(`${API_URI}/passwords`, { password: { email, service, value: newPassword } })
      console.log(res)
      setEmail('')
      setNewPassword('')
      setMessage(res.data.msg)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
      getPasswords()
    }
  }

  return (
    <div>
      {message && <p>{message}</p>}
      <div>
        <h1>Add new service</h1>
        <form onSubmit={onNewService}>
          <input type="text" name="service" placeholder="Service" value={newService} onChange={e => setNewService(e.target.value)} />
          <button type="submit">Add new service</button>
        </form>
      </div>
      <div>
        <h1>Add new password</h1>
        <form onSubmit={onNewPassword}>
          <select defaultValue='-1' onChange={e => setService(e.target.value)}>
            <option value='-1' disabled>Select a service</option>
            {services.map(({ _id, name }) => (
              <option key={_id} value={_id}>{name}</option>
            ))}
          </select>
          <input type="email" value={email} placeholder='Email' onChange={e => setEmail(e.target.value)} />
          <input type="password" value={newPassword} placeholder='New password' onChange={e => setNewPassword(e.target.value)} />
          <button type="submit">Add new password</button>
        </form>
      </div>
      <div>
        <h1>Passwords</h1>
        <table>
        {passwords.length > 0 ? (
          <thead>
            <tr>
              <th>Service</th>
              <th>Email</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>  
        ) : (
          <thead>
            <tr>
              <td>No password found</td>
            </tr>
          </thead>  
        )}
        {passwords.map(({ _id, service, email, value }) => (
          <tbody key={_id}>
            <tr>
              <td>{service.name}</td>
              <td>{email}</td>
              <td><input type="password" value={value} disabled/></td>
              <td>
                <button onClick={() => copyPassword(value)}>Copy</button>
                <button onClick={() => deletePassword(_id)}>Delete</button>
              </td>
            </tr>
          </tbody>
        ))}
        </table>
      </div>
    </div>
  );
}

export default App;
