import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import arrow from './assets/images/arrow.png'

function SaveSegmentComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [schemas, setSchemas] = useState([{ id: Date.now(), value: '' }]);
  const [segmentName, setSegmentName] = useState('');

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const options = [
    { value: "first_name", label: "First Name" },
    { value: "last_name", label: "Last Name" },
    { value: "gender", label: "Gender" },
    { value: "age", label: "Age" },
    { value: "account_name", label: "Account Name" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
  ];

  const addSchema = () => {
    setSchemas([...schemas, { id: Date.now(), value: '' }]);
  };

  const removeSchema = (id) => {
    setSchemas(schemas.filter((schema) => schema.id !== id));
  };

  const handleSelectChange = (id, selectedValue) => {
    setSchemas(
      schemas.map((schema) =>
        schema.id === id ? { ...schema, value: selectedValue } : schema
      )
    );
  };

  // const saveSegment = () => {
  //   const formattedSchemas = schemas
  //     .filter((schema) => schema.value)
  //     .map((schema) => ({
  //       key: schema.value,
  //       value: options.find((option) => option.value === schema.value).label,
  //     }));
    
  //   console.log("Segment Name:", segmentName);
  //   console.log("Schemas:", formattedSchemas);
  // };


  const saveSegment = async () => {
    const formattedSchemas = schemas
      .filter((schema) => schema.value)
      .map((schema) => ({
        [schema.value]: options.find((option) => option.value === schema.value).label,
      }));

    const payload = {
      segment_name: segmentName,
      schema: formattedSchemas,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post('https://webhook.site/d7272542-7663-4a24-8e4d-645f499ea88d', payload);
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Get the values already selected to filter options
  const selectedValues = schemas.map((schema) => schema.value);


  return (
    <div className="App">
      <div className='lg:container mx-auto mt-8 relative'>
        {isVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={toggleVisibility}
          ></div>
        )}
        <button
          className='border-2 border-white bg-cyan-500 text-white relative z-40 py-2 px-4'
          onClick={toggleVisibility}
        >
          Save segment
        </button>
      </div>
      <div
        className={`w-1/3 h-full fixed right-0 top-0 bg-white transform transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className='flex items-center gap-4 bg-cyan-500 py-5 px-4 '>
          <button
            onClick={toggleVisibility}
            className='font-semibold'><img src={arrow} width={20} height={20} />
          </button>
          <h1 className=' text-xl text-white font-semibold'>Saving segment</h1>
        </div>
        <div className='py-6 px-4'>
          <div className='flex flex-col gap-3'>
            <label>Enter the name of the Segment</label>
            <input 
                className='p-4 border border-gray-300 outline-none focus:border-cyan-500' type='text' 
                placeholder='Name of the segment'
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)} />
            <p className='py-3'>To save your segment,you need to add the schemas to bulid the query</p>
          </div>
          <ul className='flex items-center justify-end gap-4'>
            <li className="text-sm relative before:content-[''] before:w-2 before:h-2 before:bg-emerald-400 before:rounded-full before:inline-block before:mr-2">
              - User Tracks
            </li>
            <li className="text-sm relative before:content-[''] before:w-2 before:h-2 before:bg-red-500 before:rounded-full before:inline-block before:mr-2">
              - Group Tracks
            </li>
          </ul>
          <div className="my-8">
            {schemas.map((schema) => (
              <div key={schema.id} className="flex items-center justify-between mb-4">
                <span className="text-sm w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
                <div style={{ width: 'calc(100% - 40px)' }}>
                  <select
                    name="schema"
                    className="w-full bg-transparent p-4 border border-gray-300 outline-none"
                    value={schema.value}
                    onChange={(e) => handleSelectChange(schema.id, e.target.value)}
                  >
                    <option value="" disabled>
                      Add schema to segment
                    </option>
                    {options
                      .filter((option) => !selectedValues.includes(option.value) || option.value === schema.value)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
                <button
                  className="text-4xl inline-block"
                  onClick={() => removeSchema(schema.id)}
                >
                  -
                </button>
              </div>
            ))}

            <button
              className="text-green-400 text-sm font-semibold underline mt-3"
              onClick={addSchema}
            >
              + Add new schema
            </button>
          </div>
        </div>
        <div className='w-full fixed bottom-0 right-0 bg-gray-200 flex gap-3 p-6'>
          <button 
          onClick={saveSegment}
              className='bg-green-400 font-semibold text-white text-base rounded py-2 px-3'>
                Save the segment
          </button>
          <button className='bg-white font-semibold text-red-600 text-base rounded py-2 px-3'>Cancle</button>
        </div>
      </div>
    </div>
  );
}

export default SaveSegmentComponent;
