import { Button, DatePicker, Form, Input, Popconfirm, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import Searchicon from '../assets/searchicon';
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

    setRecord(data);
  }

  useEffect(() => {
    fetchData();
  }, [])


  // Table actions

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filterInfo, setFilterInfo] = useState({});
  let [filteredData] = useState();

  const isEditing = (record) => record.key === editingKey;

  const edit = (data) => {
    form.setFieldsValue({
      title: data.title,
      description: data.description,
      duedate: "",
    })
    setEditingKey(data.key);
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...record];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];

        const { id, status, tags, timestamp, timezone } = item;

        var data = {
          id: id,
          ...row,
          status: status,
          tags: tags,
          timestamp: timestamp,
          timezone: timezone,
          duedate: row.duedate != '' ? new Date(row.duedate).toISOString() : "none",
        };
        // console.log(item);
        console.log(row.duedate);
        newData.splice(index, 1, { ...item, ...row });

        const res = await fetch(`${API_URl}/tasks/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        fetchData();
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

  const handleChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setFilterInfo(filter);
    setSortedInfo({ columnKey: field, order });
  }

  const reset = () => {
    setSortedInfo({});
    setSearchText('');
    setFilterInfo({});
    fetchData();
  }


  const handleSearchText = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      fetchData();
    }
  }

  const globalSearch = () => {
    filteredData = record.filter((value) => {
      return (
        value.title.toLowerCase().includes(searchText.toLowerCase()) || value.description.toLowerCase().includes(searchText.toLowerCase())
      )
    });

    setRecord(filteredData);
  }

  const columns = [
    {
      title: 'C.D',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      sorter: (a, b) => moment(new Date(a.createdAt).toISOString()) - moment(new Date(b.createdAt).toISOString()),
      sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      editTable: true,
      ellipsis: true,
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      editTable: true,
      sorter: (a, b) => a.description.length - b.description.length,
      sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: "Open", value: "open" },
        { text: "Working", value: "working" },
        { text: "Overdue", value: "overdue" },
        { text: "Done", value: "done" },
      ],
      filteredValue: filterInfo.status || null,
      onFilter: (value, record) => String(record.status).includes(value),
      render: (status) => (
        <span className={` py-1 px-3 font-poppins font-bold rounded-md text-md ${status == 'overdue' ? ' bg-rose-300' : (status == 'working' ? ' bg-cyan-300' : 'bg-lime-300')}`}>{status.toUpperCase()}</span>
      )
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      ellipsis: true,
      filters: [
        { text: "#Home", value: "#Home" },
        { text: "#Relax", value: "#Relax" },
        { text: "#Work", value: "#Work" },
        { text: "#Cool", value: "#Cool" },
      ],
      filteredValue: filterInfo.tags || null,
      onFilter: (value, record) => String(record.tags).includes(value),
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
      ellipsis: true,

      sorter: (a, b) => moment(a.duedate ? a.duedate : new Date()) - moment(b.duedate ? b.duedate : new Date()),
      sortOrder: sortedInfo.columnKey === 'duedate' && sortedInfo.order,
      render: (duedate) => (
        <span>{duedate != "none" ? moment(duedate).format("YYYY-MM-DD") : "NA.."}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      ellipsis: true,
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
                  required: inputType == 'duedate' ? false : true,
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
    <div className=' flex flex-col p-2'>

      <div className=' w-full flex justify-center space-x-2 my-5'>
        <div className=' flex space-x-2'>
          <Input className=' max-w-md border-2 border-slate-800 text-lg font-bold'
            placeholder='enter to search...'
            onChange={handleSearchText}
            type="text"
            allowClear
            value={searchText}
          />
          <span onClick={globalSearch} className=' cursor-pointer flex space-x-1 justify-center items-center rounded-md w-16 md:w-36 px-3 bg-primary hover:bg-slate-700'>
            {<Searchicon />}
            <span className=' hidden md:block text-white text-xl font-bold font-poppins'>Search</span>
          </span>
        </div>
        <button onClick={reset} className=' cursor-pointer bg-indigo-500 text-white font-poppins font-bold py-2 px-4 rounded-lg text-xl hover:bg-slate-400 hover:text-slate-800'>Reset</button>
      </div>

      <Form className='' form={form} component={false}>
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
          dataSource={filteredData && filteredData.length >= 1 ? filteredData : record}
          onChange={handleChange}
          bordered
        />
      </Form>
    </div>
  );
};
export default Task;