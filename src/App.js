import React, { useEffect, useState } from "react";
import { data } from "./data";
// import './style.css';

function App() {
  const [datas, setDatas] = useState([]);
  const [countryId, setCountryId] = useState(-1);

  const handleSelect = (e) => {
    console.log(e.target.value);
    setCountryId(e.target.value - 1);
    // console.log(data[0]["state"][0]['city']);
  };

  useEffect(() => {
    setDatas(data);
  }, []);

  return (
    <div className="App">
      <h1>Hello</h1>

      <select onChange={handleSelect}>
        <>
          <option key="item.id" value="None">
            None
          </option>
          {datas &&
            datas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.country}
              </option>
            ))}
        </>
      </select>
      <Country countryId={countryId} />
    </div>
  );
}

export default App;

function Country({ countryId }) {
  const [states, setStates] = useState("");
  const [selectedItems, setSelectedItems] = useState("");

  const selectCityandState = (stateName, cityName, checked) => {
    let temp = JSON.parse(states);

    temp.map((s, idx) => {
      if (s.state === stateName) {
        return temp[idx]["city"].map((c) => {
          if (c.name === cityName) {
            return (c.visible = checked);
          }
        });
      }
    });

    let anyCheck = false;
    temp.forEach((s, idx) => {
      if (s.state === stateName) {
        temp[idx]["city"].forEach((c) => {
          if (c.visible === true) {
            anyCheck = true;
          }
        });
      }
    });

    temp.map((s, idx) => s.state === stateName && (s.visible = anyCheck));

    setStates(JSON.stringify(temp));
    // console.log(temp);
  };

  const selectAllCity = (allCityChecked, state) => {
    let temp = JSON.parse(states);
    temp.map((s, idx) => {
      if (s.state === state) {
        temp[idx]["visible"] = allCityChecked;
        return temp[idx]["city"].map((c) => (c.visible = allCityChecked));
      }
    });
    // console.log(temp);
    setStates(JSON.stringify(temp));
  };

  const handleSubmit = () => {
    let temp = JSON.parse(states);
    let res = [];
    temp.forEach((s, idx) => {
      if (s.visible) {
        res.push(s.state);
        temp[idx]["city"].forEach((c) => {
          if (c.visible) {
            res.push(c.name);
          }
        });
      }
    });
    // console.log(res);
    setSelectedItems(res);
  };

  useEffect(() => {
    if (countryId >= 0) {
      let temp = [];
      data[countryId]["state"].forEach((state) => {
        state.visible = false;
        state.city.map((city) => (city.visible = false));
        temp.push(state);
      });
      setStates(JSON.stringify(temp));
    } else {
      setStates("");
    }
  }, [countryId]);

  return (
    <div>
      {states &&
        JSON.parse(states).map((state) => (
          <>
            <States
              selectAllCity={selectAllCity}
              selectCityandState={selectCityandState}
              state={state}
              key={`${state.id}_${state.state}`}
            />
          </>
        ))}

      <button onClick={handleSubmit}>submit</button>
      <div>Selected: {JSON.stringify(selectedItems)}</div>
    </div>
  );
}

function States({ state, selectCityandState, selectAllCity }) {
  const [states, setStates] = useState("");
  const [checked, setChecked] = useState(false);

  const selectCity = (cityName, checked) => {
    let temp = JSON.parse(states);
    selectCityandState(temp.state, cityName, checked);
    // console.log(temp.state);
  };

  function toggle(value) {
    selectAllCity(!value, state.state);
    return !value;
  }

  useEffect(() => {
    setStates(JSON.stringify(state));
    setChecked(state.visible);
  }, [state]);

  return (
    <div>
      <input
        checked={state.visible}
        onChange={() => setChecked(toggle)}
        type="checkbox"
        id={`${state.id}_${state.state}`}
        name="state"
        value={state.id}
      />
      <label htmlFor="state">{state.state}</label>
      <br />
      <City cty={states} selectCity={selectCity} />
    </div>
  );
}

function City({ cty, selectCity }) {
  const [datas, setDatas] = useState("");

  useEffect(() => {
    setDatas(cty);
  }, [cty]);

  return (
    <div style={{ margin: "0 0 0 1.2rem" }}>
      {datas &&
        JSON.parse(datas)["city"].map((c) => (
          <CityName c={c} selectCity={selectCity} />
        ))}
    </div>
  );
}

function CityName({ c, selectCity }) {
  const [checked, setChecked] = useState(false);

  function toggle(value) {
    selectCity(c.name, !checked);
    return !value;
  }

  useEffect(() => {
    setChecked(c.visible);
  }, [c]);

  return (
    <>
      <input
        checked={checked}
        onChange={() => setChecked(toggle)}
        type="checkbox"
        id={c.id}
        name="state"
        value={c.name}
      />
      <label htmlFor="state">{c.name}</label>
      <br />
    </>
  );
}
