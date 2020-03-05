 import React, { useEffect, useReducer, useState }  from 'react'
 import { Auth, API, graphqlOperation } from 'aws-amplify'
 import './App.css';

 import { withAuthenticator } from 'aws-amplify-react'

 // import query
 import { listBooks } from './graphql/queries'

 import { createBook as CreateBook } from './graphql/mutations'

 import uuid from 'uuid/v4'

 const BOOK_ID = uuid()

 // create initial state
 const initialState = {
   name: '', price: '', category: '', description: '', books: []
 }

 // create reducer to update state
 function reducer(state, action) {
   switch(action.type) {
     case 'SETBOOKS':
       return { ...state, books: action.books }
     case 'SETINPUT':
       return { ...state, [action.key]: action.value }
     default:
       return state
   }
 }


 function App() {
   useEffect(() => {
     Auth.currentAuthenticatedUser()
       .then(user => console.log({ user }))
       .catch(error => console.log({ error }))
   })

   const [state, dispatch] = useReducer(reducer, initialState)

   useEffect(() => {
     getData()
   }, [])

   async function getData() {
     try {
       const bookData = await API.graphql(graphqlOperation(listBooks))
       console.log('data from API: ', bookData)
       dispatch({ type: 'SETBOOKS', books: bookData.data.listBooks.items})
     } catch (err) {
       console.log('error fetching data..', err)
     }
   }

   async function createBook() {
     const { name, price, category, description } = state
     if (name === '' || price === '' || category === '' || description === '') return
     const book = {
       name, price: parseFloat(price), category, description, bookId: BOOK_ID
     }
     const books = [...state.books, book]
     dispatch({ type: 'SETBOOKS', books })
     console.log('book:', book)
     
     try {
       await API.graphql(graphqlOperation(CreateBook, { input: book }))
       console.log('item created!')
     } catch (err) {
       console.log('error creating book...', err)
     }
   }

   // change state then user types into input
   function onChange(e) {
     dispatch({ type: 'SETINPUT', key: e.target.name, value: e.target.value })
   }

   let [message, setMessage] = useState('')

 async function getMessageData() {
     let apiName = 'amplifyrestapi';
     let path = '/items';
     let myInit = { // OPTIONAL
         headers: {} // OPTIONAL
     }
     const apiResponse = await API.get(apiName, path, myInit);
     setMessage(apiResponse.success)
     console.log(apiResponse)
     return apiResponse.success
 }

   return (
     <div className="App">
       <br/><br/>
       <input
         name='name'
         placeholder='name'
         onChange={onChange}
         value={state.name}
       />
       <input
         name='price'
         placeholder='price'
         onChange={onChange}
         value={state.price}
       />
       <input
         name='category'
         placeholder='category'
         onChange={onChange}
         value={state.category}
       />
       <input
         name='description'
         placeholder='description'
         onChange={onChange}
         value={state.description}
       />
       <button onClick={createBook}>Create Book</button>

       <br/>
       <br/>
       {
         state.books.map((c, i) => (
           <div key={i}>
             <h2>Title: {c.name}</h2>
             <h4>Category: {c.category}</h4>
             <h4>Description: {c.description}</h4>
             <p>Price: {c.price}</p>
           </div>
         ))
       }

	<br/>
	    This is the message from REST API: {message}
 <br/>
 <button onClick={() => getMessageData()}>
 	Show message
 </button>
 <br/>
     </div>
   );
 }

 export default withAuthenticator(App, { includeGreetings: true })
