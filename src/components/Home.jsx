import React, { useState } from 'react'
import moment from 'moment-timezone';
import { toast } from "react-hot-toast";
import {
  Button,
  DatePicker,
  Form,
  Tag,
  Radio,
  Input,
  Select
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

// for tags
const { CheckableTag } = Tag;



import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const disabledDate = (day) => {
  // Can not select days before today and today
  return day && day < dayjs().endOf('day');
};

import todo from "../assets/to-do.svg";

const API_URl = 'https://63bef13f585bedcb36bb42cb.mockapi.io/api/to-do';

export const Home = () => {

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values);

    const data = {
      title: values.title,
      description: values.description,
      status: values.status,
      tags: selectedTags,
      duedate: values.duedate ? values.duedate : "none",
      timestamp: new Date().getTime(),
      timezone: moment.tz.guess(),
    }

    const res = await fetch(`${API_URl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    toast.success(`Don't worry we have this!!`, {
      duration: 3000,
      icon: "👏️😉️",
      style: {
        borderRadius: '10px',
        background: '#1b1b19',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 800,
      },
    });

    form.resetFields();
    setSelectedTags([]);
  }

  //// tags started ...
  const tagsData = ['#Cool', '#Work', '#Home', '#Relax'];

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  //// tags ended...

  return (
    <div className=' w-full min-h-screen px-8 py-5'>

      <div className=' w-full'>
        <h1 className=' font-dynapuff font-semibold text-4xl'>Hey! there</h1>
        <h2 className=' px-6 font-poppins font-semibold text-2xl'> Let's us get your tasks line-up 😊️ </h2>
      </div>

      <div className=' flex mt-14 w-full justify-between'>

        <div className=' hidden 2xl:flex flex-col h-[700px] w-[35%] items-center space-y-32 p-16 bg-primary rounded-2xl'>
          <h2 className=' text-white text-2xl font-poppins font-bold'>Don't miss any Tasks with <span className=' text-gradient-blue font-dynapuff text-3xl'>Todo-ler</span> 😊️</h2>
          <img src={todo} className=' w-[500px]' style={{ objectFit: 'contain' }} alt="todo" />
        </div>


        <div className=' bg-rose-100/60 w-full xl:w-[70%] 2xl:w-[60%] flex items-center h-[700px] rounded-2xl overflow-hidden'>

          <div className=" w-full flex rounded-2xl">

            <div className=' w-full relative'>

              <div className="absolute top-16 left-32 w-72 h-72 bg-indigo-200 rounded-full
    filter blur-xl opacity-90 animate-blob animation-delay-2000"></div>

              <div className="absolute top-16 right-52 w-72 h-72 bg-rose-300 rounded-full
    filter blur-xl opacity-80 animate-blob animation-delay-4000"></div>

              <div className="absolute bottom-24 left-52 w-72 h-72 bg-teal-200 rounded-full
     filter blur-xl opacity-80 animate-blob animation-delay-3000"></div>

              <Form
                form={form}

                className=' flex flex-col w-full p-10 bg-transparent relative '

                labelCol={{
                  span: 50,
                }}

                wrapperCol={{
                  span: 90,
                }}

                layout="vertical"
                size='large'
                onFinish={onFinish}

                initialValues={{
                  status: "open"
                }}
              >


                <Form.Item label="Title" name="title">
                  <Input required={true} placeholder="enter title here..." />
                </Form.Item>

                <Form.Item label="Description" name="description" >
                  <TextArea required={true} placeholder="describe it..." />
                </Form.Item>

                <Form.Item label="Status" name="status">
                  <Select>
                    <Select.Option name="open" value="open">Open</Select.Option>
                    <Select.Option name="working" value="working">Working</Select.Option>
                    <Select.Option name="done" value="done">Done</Select.Option>
                    <Select.Option name="overdue" value="overdue">Overdue</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="DatePicker" name="duedate">
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate} />
                </Form.Item>


                <Form.Item label="Tag">
                  {tagsData.map((tag) => (
                    <CheckableTag
                      key={tag}
                      style={{
                        fontFamily: "sans-serif",
                        padding: 5,
                        fontSize: 18,
                        fontWeight: 900,
                      }}
                      checked={selectedTags.indexOf(tag) > -1}
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </Form.Item>

                <Button type="primary" htmlType="submit" className=" bg-indigo-500 font-bold w-44 md:w-96">
                  Submit
                </Button>

              </Form>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Home;