import { DatePicker, Form, Input, Popconfirm, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

import moment from 'moment-timezone'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const disabledDate = (day) => {
  // Can not select days before today and today
  return day && day < dayjs().endOf('day');
};


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

      const date = moment.tz(detail.timestamp, detail.timezone).format("YYYY-MM-DD h:mm a");

      return { ...detail, key: index + 1, createdAt: date };
    });

    // console.log(data);
    setRecord(data);
  }

  useEffect(() => {
    fetchData();
  }, [])


  // Table actions

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const edit = (data) => {
    console.log(moment(data.duedate));
    form.setFieldsValue({
      title: data.title,
      description: data.description,
      duedate: "",
    })
    console.log("hello");
    setEditingKey(data.key);
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...record];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setRecord(newData);
        setEditingKey('');
      }
    }
    catch (error) {
      console.log("error : ", error);
    }
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
      editTable: true,
      sorter: (a, b) => a.title.length - b.title.length,

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editTable: true,
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
      align: 'center',
      editTable: true,
      sorter: (a, b) => moment(a.duedate ? a.duedate : new Date()) - moment(b.duedate ? b.duedate : new Date()),
      render: (duedate) => (
        <span>{duedate != null ? moment(duedate).format("YYYY-MM-DD") : "NA.."}</span>
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
              className=' bg-sky-500 py-1 px-2 rounded-lg text-slate-50 font-bold font-poppins hover:bg-slate-300 hover:text-slate-800'
            >
              Edit
            </a>

            <Popconfirm okButtonProps={{ style: { color: "white", fontWeight: 800, background: "red" } }}

              title="Sure to delete?" onConfirm={() => handleDelete(record)}>
              <a
                className=' bg-rose-400 py-1 px-2 rounded-lg text-slate-50 font-bold font-poppins  hover:bg-slate-300 hover:text-slate-800'
              >Delete</a>
            </Popconfirm>

          </Space>

        )


      },
    },
  ];


  const mergedColumns = columns.map((col) => {
    if (!col.editTable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'duedate' ? 'duedate' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      })
    }
  })

  const EditableCell = ({ editing, dataIndex, inputType, title, record, children, ...restProps }) => {

    // console.log("Record : ");
    // console.log(record);

    const inputNode = inputType == 'duedate' ?
      (<DatePicker
        format="YYYY-MM-DD"
        disabledDate={disabledDate} />)

      :

      (<Input />);

    return (
      <td {...restProps}>
        {
          editing ? (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex}
              rules={[
                {
                  required: true,
                  message: `Please input ${title} field`,
                }
              ]}
            >
              {inputNode}
            </Form.Item>
          )
            :
            (children)

        }
      </td>
    )
  }

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            }
          }}
          scroll={{
            x: true,
          }}
          tableLayout='auto'
          pagination={{
            position: ['none', 'bottomCenter'],
            defaultCurrent: 1,
            pageSize: 5,
            total: record.length,
            showSizeChanger: true,
          }}
          dataSource={record}
        />
      </Form>
    </div>
  );
};
export default Task;