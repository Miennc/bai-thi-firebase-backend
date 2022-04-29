import React, { useEffect, useState, useRef } from "react";
import {useNavigate, Link} from 'react-router-dom'
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import uniqid from 'uniqid';

const Add = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState(0);
  let unsub = null;

  const post = async () => {
    if(title === '' || content === '' || category === ''){
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }else {
      const collectionRef = collection(db, "list");
     await addDoc(collectionRef, {
      title: title,
      id: uniqid(),
      content: content,
      category: category,
    });
    }
  }
  
  const deleteArticles = async (id) => {
    const docRef = doc(db, "list", id);
    await deleteDoc(docRef);
  };
  const addCategory = async ()=>{
    const collectionRef = collection(db, "category");
    await addDoc(collectionRef,{
      category: category,
    })
    setCategory('')
  }

  useEffect(() => {
    (async () => {
      const collectionRef = collection(db, 'list');
      unsub = onSnapshot(collectionRef, (snapShot) => {
        const localTodos = [];
        snapShot.forEach(doc => {
          localTodos.push({
              id: doc.id,
              title: doc.data().title,
              content: doc.data().content,
              category_id: category.id,
              id_user: doc.data().id
          });
      });
      setTodos(localTodos);
      setContent('');
      setTitle('');
  });
  })();
  }, [])
  
   useEffect(() => {
      const collectionRef = collection(db, 'category');
      onSnapshot(collectionRef, (snapShot) => {
        const categories = [];
        snapShot.forEach(doc => {
          categories.push({
              id: doc.id,
              category: doc.data().category,
          });
      });
      setCategories(categories);
  });
   }, []);


   const removeCategories = async (id)=>{
    const docRef = doc(db, 'category', id);
    await deleteDoc(docRef)
   }
  return (
    <div className="container mt-2 mx-auto">
     <div>
     <div className="flex justify-around">
        <div>
          <label htmlFor="comment" className="text-lg text-gray-600"></label>
          <h1>Home</h1>
          <input
            onChange={(evt) => setTitle(evt.target.value)}
            value={title}
            className="w-96 border-2 border-green-500 p-2"
            name="comment"
            placeholder="title"
          ></input>
          <br/>

          <label htmlFor="comment" className="text-lg text-gray-600"></label>
          <input
            onChange={(evt) => setContent(evt.target.value)}
            value={content}
            className="w-96 border-2 border-green-500 p-2"
            name="comment"
            placeholder="content"
          ></input>
          <br/>
          <select name="cars" id="cars" onChange={(e)=>setCategory(e.target.value)} className="w-96 border-2 border-green-500 p-2">
                        {
                            categories?.map((listCategoryItem,listCategoryIndex)=>{
                                return(
                                    <option key={listCategoryIndex} value={listCategoryItem.category} >{listCategoryItem.category}</option>
                                )
                            })
                        }
                    </select>
          <br/>
          <button className="bg-red-500 p-2" onClick={post}>POST</button>
        </div>

        <div>
        <input type="text" placeholder="category"  value={category} onChange={(e) => setCategory(e.target.value)}  className="w-96 border-2 border-green-500 p-2"/>
        <button className="bg-red-500 p-2" onClick={addCategory} >ADD CATEGORY</button>
          <div>
            {
              categories.map((item,index)=>{
                return (
                  <div className="text-bold text-3xl  mt-2" key={index}>
                    {item.category}
                    <button onClick={removeCategories.bind(this, item.id)} className="text-red-500 mx-2">xóa</button>
                  </div>
                )
              })
            }
          </div>
      </div>

      </div>

      

     </div>
      <div className="mt-10">
        {todos?.map((item, index) => (
                        <div className='flex items-center justify-between my-2' key={index}>
                            <p><span>{index+1}</span>. {item.content}</p> 
                            <p>{item.title}</p>
                            <p>{item.category}</p>
                            <div >
                                <button className="bg-red-500 p-2">
                                <Link to={`/edit?id=${item.id}`}>Sửa</Link>
                                </button>
                                <button onClick={() => deleteArticles(item.id)} className='px-3 ml-2 py-2 text-sm text-blue-100 bg-blue-600 rounded'>Xóa</button>
                            </div>
                        </div>
                    ))}
      </div>
    </div>
  );
};

export default Add;
