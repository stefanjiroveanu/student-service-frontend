import axios from "axios";
import React, {useDebugValue, useEffect, useReducer, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './StyledComponents.css';

export default function AddMarks() {
    let navigate = useNavigate();

    const { id } = useParams();

    const [gradeModel, setGradeModel] = useState({
        firstname: "",
        lastname: "",
        studentId: "",
        grades: [{
            discipline:"",
            date:"",
            grade:""
        }]
    });
    const [disciplineName, setDisciplineName] = useState({
        disciplineName:""
    })
    const inputObject = {
        "fullName":"Stefan",
        "studentId":"1",
        "gradeList":
            [{
                "discipline":"Mate",
                "grade": 5,
                "date": "04/05/2001"
            },{
                "discipline":"Mate",
                "grade": 6,
                "date": "04/05/2001"
            },{
                "discipline":"Romana",
                "grade": 7,
                "date": "04/05/2001"
            }]
    };
    function showGrade(){
        if (gradeModel.grades !== null) {
            return (
                <div>
                    <table border="1" id="customers">
                        <tbody>
                        <tr>
                            <th>Class Name</th>
                            <th>Mark</th>
                            <th>Date</th>
                        </tr>
                        {gradeModel.grades.filter(item => item.discipline.toString() === disciplineName.disciplineName.toString()).map((item, i) => (
                            <tr key={i}>
                                <td>{item.discipline}</td>
                                <td>{item.grade}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return(
            <div>
                <h4>This student does not have any grades!</h4>
            </div>
            );
        }
    }
    const onInputChange = (e) => {
        setGradeModel({ ...gradeModel, [e.target.name]: e.target.value });
    };

    const onInputChangeDiscipline = (e) => {
        setDisciplineName({ ...disciplineName, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadGrades();
    }, [disciplineName]);

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/users/update/${id}`, gradeModel);
        navigate("/");
    };

    const loadGrades = async () => {
        const result = await axios.get(`http://localhost:8081/api/students/${id}`);
        console.log(result.data);
        setGradeModel(result.data);
    };



    const [inputFields, setInputFields] = useState([
        {
            discipline: '',
            grade: '',
            date: ''
        }
    ])

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
    }

    let addMoreFirstPushed = false;
    const addFields = () => {
        let newfield = { discipline: '', grade: '', date: '' }

        addMoreFirstPushed = true;

        setInputFields([...inputFields, newfield])
    }

    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }

    const formSubmit = (e) => {
        e.preventDefault();
    }


    function addForm(){
        return(
            <div>
                    <form onSubmit={formSubmit}>
                        {inputFields.map((input, index) => {
                            if(index !== 0)
                                return (
                                    <div className="addNewGradeDiv">
                                        <div key={index}>
                                            <input
                                                name='discipline'
                                                placeholder='Discipline'
                                                type="search"
                                                value={input.discipline}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                            <input
                                                name='grade'
                                                placeholder='Grade'
                                                value={input.grade}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                            <input
                                                name='date'
                                                placeholder='Date'
                                                value={input.date}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className="addNewGradeButtons">
                                        <button onClick={formSubmit} className="btn btn-primary">Submit</button>
                                        <button onClick={() => removeFields(index)} className="btn btn-danger mx-2">Remove</button>
                                        </div>
                                    </div>
                                )
                        })}
                    </form>
            </div>
        )
    }




    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Marks for {gradeModel.firstname}</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Class name" className="form-label">
                                Class Name:
                            </label>
                            <input
                                type={"search"}
                                list = "ClassList"
                                className="form-control"
                                placeholder="Enter the class"
                                name="disciplineName"
                                onChange={(e) => onInputChangeDiscipline(e)}
                            />
                            <datalist id="ClassList">
                                <option value="Matematica">Matematica</option>
                                <option value="Limba Romana">Limba Romana</option>
                                <option value="Limba Engleza">Limba Engleza</option>
                                <option value="Fizica">Fizica</option>
                                <option value="ab">Chimie</option>
                                <option value="b">Informatica</option>
                                <option value="a">Informatica</option>
                            </datalist>
                        </div>
                        <div className="mb-3">
                            {showGrade()}
                        </div>

                        <div>
                            {addForm()}
                        </div>
                        <button type="submit" className="buttonAddGrade btn btn-outline-primary" onClick={addFields}>
                            Add Grade
                        </button>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
