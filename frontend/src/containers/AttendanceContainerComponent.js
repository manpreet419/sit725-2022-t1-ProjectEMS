import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as reportsActions from "../actions/reportsActions";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import ReactLoading from "react-loading";
import moment from 'moment'
import axios from 'axios'
import noPenaltiesIl from "../img/no-penalties-illustration.png";

import _ from "lodash";

class AttendanceContainerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      attendaceList: [],
      selectedDate: new Date()
    };
  }

  componentDidMount() {
    this.getAllData()
  }

  getAllData = () => {
    let { selectedDate } = this.state
    let today = moment(new Date(selectedDate)).format('MM-DD-YYYY')
    axios.get(`http://localhost:3001/attendance/get/${today}/${today}`).then(res => {
      console.log(res.data.data)
      this.setState({
        attendaceList: res.data.data || [],
        isLoading: false
      })
    }).catch(err => {
      this.setState({
        isLoading: false
      })
    })
  }

  employeListMain = () => {
    let array  = this.state.attendaceList || []
    array.length ? array  =  array.sort((a, b) => a.name.localeCompare(b.name)) : []
    return (array || []).map(item => {
      return (
        <tr>
          <td className="col-md-3">
            {item.name}
          </td>
          <td className="col-md-3">
            {item.attendance[0].attendanceStatus}
          </td>
          <td className="col-md-6">
            {item.attendance[0].reason || '--'}
          </td>
        </tr>
      );
    })
  }

  hanldeChangeFilter = (e) => {
    this.setState({ selectedDate: e })
  }

  render() {
    let { selectedDate } = this.state
    if (this.state.isLoading) {
      // if doing asyng things
      return (
        <div className="flexCenter">
          <ReactLoading type={"bars"} color={"pink"} />
        </div>
      );
    } // render the loading component
    return (
      <div className="container">

        <div className="row flex item-center">
          <div className="col-md-3">

            <div className="form-group datePickerCustom">
              <label htmlFor="startdate">Attendence Date *</label>
              <DateTimePicker
                onChange={(e) => this.hanldeChangeFilter(e)}
                format="DD MMM YYYY"
                time={false}
                value={selectedDate ? new Date(selectedDate) : new Date('01-01-2022')}
              />
            </div>
          </div>
          <div className="col-md-2">

            <button
              type="submit"
              className="btn btn-primary submit-button"
              onClick={(e) => this.getAllData()}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.state.attendaceList.length > 0 ? (
              <div className="portlet-body penalties__wrapper">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Today Status</th>
                      <th>Reason</th>
                      {/* <th>Description</th> */}
                    </tr>
                  </thead>
                  <tbody>{this.employeListMain()}</tbody>
                </table>
              </div>
            ) : <div className="portlet-body no-penalties__wrapper">
              <img
                src={noPenaltiesIl}
                alt="Missing data illustration"
                className="no-data__image"
              />
              <p className="no-data">
                There are no Attendence added on this date! <br />
              </p>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reports: state.reports
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(reportsActions, dispatch)
  };
};

AttendanceContainerComponent.propTypes = {
  reports: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceContainerComponent);
