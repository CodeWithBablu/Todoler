import { Radio, Space, Table, Tag } from 'antd';
import { useState } from 'react';


const columns = [
  {
    title: '',
    key: 'createdAt',
    render: (index) => (
      <span>{index + 1}</span>
    )
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span className={` py-1 px-3 font-poppins font-bold rounded-md text-md ${status == 'OVERDUE' ? ' bg-rose-300' : (status == 'WORKING' ? ' bg-cyan-300' : 'bg-lime-300')}`}>{status}</span>
    )
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = tag[2] == 'H' ? 'geekblue' : (tag[2] == 'C' ? 'cyan' : 'magenta');
          if (tag == '# Work') {
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
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          edit
        </a>,
      </Space>
    ),
  },
];


const data = [
  {
    key: '1',
    title: 'John Brown',
    description: 'I am John Brown',
    status: 'DONE',
    tags: ['# Cool', '# Work'],
  },
  {
    key: '2',
    title: 'Rohit Sharma',
    description: 'I am rohit sharma',
    status: 'WORKING',
    tags: ['# Home', '# Work'],
  },
  {
    key: '3',
    title: 'Bablu',
    description: 'I am Bablu',
    status: 'OVERDUE',
    tags: ['# Relax', '# Home'],
  },
  {
    key: '4',
    title: 'Akash Kumar',
    description: 'Hi I am Akash kumar',
    status: 'DONE',
    tags: ['# Home', '# work'],
  },
  {
    key: '5',
    title: 'Akash Kumar',
    description: 'Hi I am Akash kumar',
    status: 'DONE',
    tags: ['# Home', '# work'],
  },
];
const Task = () => {

  return (
    <div>
      <Table
        columns={columns}
        pagination={{
          position: ['none', 'bottomCenter'],
          defaultCurrent: 1,
          pageSize: 3,
          total: 5,
          showSizeChanger: true,
        }}
        dataSource={data}
      />
    </div>
  );
};
export default Task;