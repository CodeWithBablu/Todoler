import { Popconfirm, Radio, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';

import moment from 'moment-timezone'

const API_URl = 'https://63bef13f585bedcb36bb42cb.mockapi.io/api/to-do';


const Task = () => {

  const [record, setRecord] = useState([]);

  const fetchData = async () => {

    const res = await fetch(`${API_URl}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await res.json();

    data = data.map((detail, index) => {

      const date = moment.tz(detail.timestamp, detail.timezone).format("YYYY-MM-DD HH:SS");

      return { ...detail, key: index + 1, createdAt: date };
    });

    console.log(data);
    setRecord(data);
  }

  useEffect(() => {
    fetchData();
  }, [])


  // Table actions

  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const edit = (data) => {
    setEditingKey(data.key);
  }

  const save = (key) => {

  }

  const cancel = () => {
    setEditingKey('');
  }

  const handleDelete = (data) => {

    const filterData = record.filter((item) => item.id !== data.id);
    setRecord(filterData);
  }

  const columns = [
    {
      title: 'C.D',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={` py-1 px-3 font-poppins font-bold rounded-md text-md ${status == 'overdue' ? ' bg-rose-300' : (status == 'working' ? ' bg-cyan-300' : 'bg-lime-300')}`}>{status.toUpperCase()}</span>
      )
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            let color = tag[1] == 'H' ? 'geekblue' : (tag[1] == 'C' ? 'cyan' : 'magenta');
            if (tag == '#Work') {
              color = 'green';
            }
            return (
              <Tag color={color} key={tag} className=' font-poppins text-md font-bold'>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      key: 'duedate',
      render: (duedate) => (
        <span>{duedate != null ? moment(duedate).format("YYYY-MM-DD HH:SS") : "NA.."}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {

        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">

            <a
              key="editable"
              onClick={() => save(record.key)}
              className=' bg-lime-300 py-1 px-2 rounded-lg font-bold font-poppins hover:bg-slate-300 hover:text-slate-800'
            >
              Save
            </a>

            <Popconfirm okButtonProps={{ style: { color: "white", fontWeight: 800, background: "red" } }}

              title="Sure to cancel?" onConfirm={cancel}>
              <a
                className=' bg-indigo-300 py-1 px-2 rounded-lg font-bold font-poppins  hover:bg-slate-300 hover:text-slate-800'
              >Cancel</a>
            </Popconfirm>
          </Space>
        ) : (

          <Space size="middle">
            <a
              key="editable"
              onClick={() => {
                edit(record)
              }}
              className=' bg-cyan-300 py-1 px-2 rounded-lg font-bold font-poppins hover:bg-slate-300 hover:text-slate-800'
            >
              Edit
            </a>

            <Popconfirm okButtonProps={{ style: { color: "white", fontWeight: 800, background: "red" } }}

              title="Sure to delete?" onConfirm={() => handleDelete(record)}>
              <a
                className=' bg-rose-400 py-1 px-2 rounded-lg font-bold font-poppins  hover:bg-slate-300 hover:text-slate-800'
              >Delete</a>
            </Popconfirm>

          </Space>

        )


      },
    },
  ];


  return (
    <div>
      <Table
        columns={columns}
        scroll={{
          x: true,
        }}
        tableLayout='auto'
        pagination={{
          position: ['none', 'bottomCenter'],
          defaultCurrent: 1,
          pageSize: 2,
          total: record.length,
          showSizeChanger: true,
        }}
        dataSource={record}
      />
    </div>
  );
};
export default Task;