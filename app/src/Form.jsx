import React, {useState} from 'react';

const Form = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('file', file);
        fetch('http://159.89.55.158:4000/items', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            // alert on confirm refresh page
            alert('Video uploaded successfully');
            window.location.reload();
            // props.GetData();
        })
        .catch(err => console.log(err));
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Upload Video</h3>
            <label>Name</label>
            <input placeholder='Enter name' className="form-control mb-2" type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
            <label>Description</label>
            <input placeholder='Enter description' className="form-control mb-2" type="text" name="description" value={description} onChange={e => setDescription(e.target.value)} />
            <label>File</label>
            <input className="form-control mb-2" type="file" name="file" onChange={e => setFile(e.target.files[0])} />
            <button
                className='btn btn-dark'
            type="submit">Submit</button>
        </form>
    )
}

export default Form;