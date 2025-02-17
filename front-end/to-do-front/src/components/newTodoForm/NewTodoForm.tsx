import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { Task } from '../../interfaces/TaskInterface';
import { createTask } from '../../store/actions';
import bootstrap from 'bootstrap';

interface ModalProps {
    show: boolean;
    onCancel: any;
    setShow: any;
    setStart: any;
    start: boolean;
}

export function NewTodoForm(props : ModalProps){

    const dispatch = useDispatch<AppDispatch>();
    const [validated, setValidate] = useState(false);
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('Low');
    const [date, setDate] = useState(Date());
    const [dueDated, setDueDated] = useState(false);

    const handleSubmit = () => {
        if(validated){
            const newTask:Task = {description: text, priority: priority};
            if(dueDated)
                newTask.dueDate = new Date(date);
            dispatch(createTask(newTask))
            .then(() => {
            alert('Task added successfully!');
        setText('');
        setDate(Date());
        setPriority('Low');
        props.setShow(false);
        props.setStart(!props.start);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        alert('Failed to add the task.');
      });
        }
    }

    // COMMENT: Intenta separar ésto por componentes individuales

    return (
        <Modal
            show={props.show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-1">
                    <Form.Group as={Col} md="4" controlId="title">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            required
                            maxLength={120}
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Describe the task" />
                        <Form.Control.Feedback type='invalid'>The title should be at most 20 letters long</Form.Control.Feedback>
                    </Form.Group>
                    </Row>
                    <Row className='mb-2'>
                    <Form.Group as={Col} md="4" controlId="Priority">
                        <Form.Label>Priority *</Form.Label>
                        <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>Select a priority</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="dueDate">
                    <Form.Check inline
                    label="Due date"
                    name="Dua date"
                    checked={dueDated}
                    onChange={(e) => setDueDated(!dueDated)}
                  />
                  {dueDated &&
                                            <Form.Group>
                                             <Form.Control
                                                 type="date"
                                                 placeholder="Due date"
                                                 aria-describedby="datePicker"
                                                 value={date}
                                                 onChange={(e) => setDate(e.target.value)}
                                                 />
                                             <Form.Control.Feedback type="invalid">
                                                 Please choose a valid date.
                                             </Form.Control.Feedback>
                                            </Form.Group>
                      }
                    </Form.Group>
                </Row>
                <Button type="submit" variant='primary'>Create Task</Button>
                <Button onClick={props.onCancel} variant='secondary'>Cancel</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            </Modal.Footer>
      </Modal>
    )
  }
