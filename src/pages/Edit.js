import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from "../firebase";
import {useNavigate, Link} from 'react-router-dom'

const Edit = () => {
    let navigate = useNavigate();
    const [searchParam] = useSearchParams();
    const [message, setMessage] = useState('');
    useEffect(() => {
        (async () => {
            const docRef = doc(db, 'list', searchParam.get('id'));
            const docSnapshot = await getDoc(docRef);
            setMessage(docSnapshot.data().content);
        })();
    }, []);

    const editNote = async () => {
        const docRef = doc(db, 'list', searchParam.get('id'));
        await updateDoc(docRef, {content: message});
        alert('Sửa thành công');
        navigate('/')
    };

    return (
        <div className='container mx-auto'>
            <div >
            <h1 className='font-bold my-10 uppercase'>Edit bài viết</h1>    
            <div >
                <textarea value={message} onChange={(evt) => setMessage(evt.target.value)} className="w-96 p-5 border-2 border-red-500"
                    name="comment" placeholder=""></textarea>
            </div>
            <button onClick={editNote} className="px-3 mt-5 py-2 text-sm text-blue-100 bg-blue-600 rounded">Sửa</button> 
            </div>
        </div>
    );
};

export default Edit;