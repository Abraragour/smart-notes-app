import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { userContext } from './userContext';

export const noteContext = createContext()

export default function NoteContextProvider(props) {
const {userToken}=useContext(userContext);

const BASE_URL = `https://smart-notes-backend-production.up.railway.app/api/notes/`;

async function addNotes(note){
  const token = localStorage.getItem('userToken');
  try {
    let { data } = await axios.post(BASE_URL, note, { 
      headers: { Authorization: `Token ${token}` } 
    });
    return {data}; 
  } catch (error) {
    return error.response?.data || error; 


  }
 }

async function getallUserNotes() {
  const token = localStorage.getItem('userToken');
  try {
    let { data } = await axios.get(BASE_URL, {
      headers: { Authorization: `Token ${token}` }
    }); 
    return {data}; 
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function updateNote(currentNoteId, note) {
  const token = localStorage.getItem('userToken');
  try {
    let { data } = await axios.put(
      `${BASE_URL}${currentNoteId}/`,
      note, 
      { headers: { Authorization: `Token ${token}` } }
    );
   return {data};  
  } catch (err) {
    console.log("Update Error:", err);
    return err;
  }
}

async function deleteNote(currentNoteId) {
  const token = localStorage.getItem('userToken');
  try {
    let { data } = await axios.delete(
      `${BASE_URL}${currentNoteId}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    return {data}; 
  } catch (err) {
    console.log("Delete Error:", err);
    return err;
  }
}

  return (
    <noteContext.Provider value={{ updateNote,deleteNote, getallUserNotes, userToken, addNotes}}>
      {props.children}
    </noteContext.Provider>
  )
}