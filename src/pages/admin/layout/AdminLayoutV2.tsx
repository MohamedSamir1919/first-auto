import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';

type Props = {}

const AdminLayoutV2 = (props: Props) => {

  return <div>


    <div>

      <div className="">
        <div className="sidebar">
          <div className="sidebar-inner">
            {/* <!-- ### $Sidebar Header ### --> */}
            <div className="sidebar-logo">
              <div className="peers ai-c fxw-nw">
                <div className="peer peer-greed">
                  <NavLink className="sidebar-link td-n" to="/admin">
                    <div className="peers ai-c fxw-nw">
                      <div className="peer">
                        <div className="logo">
                          <img src="assets/static/images/logo.png" alt="" />
                        </div>
                      </div>
                      <div className="peer peer-greed">
                        <h5 className="lh-1 mB-0 logo-text">Adminator</h5>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="peer">
                  <div className="mobile-toggle sidebar-toggle">
                    <NavLink to="#" className="td-n">
                      <i className="ti-arrow-circle-left"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- ### $Sidebar Menu ### --> */}
            <ul className="sidebar-menu scrollable pos-r">
              <li className="nav-item mT-30 actived">
                <NavLink className="sidebar-link" to="/admin">
                  <span className="icon-holder">
                    <i className="c-blue-500 ti-home"></i>
                  </span>
                  <span className="title">Dashboard</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/email">
                  <span className="icon-holder">
                    <i className="c-brown-500 ti-email"></i>
                  </span>
                  <span className="title">Email</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/compose">
                  <span className="icon-holder">
                    <i className="c-blue-500 ti-share"></i>
                  </span>
                  <span className="title">Compose</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/calendar">
                  <span className="icon-holder">
                    <i className="c-deep-orange-500 ti-calendar"></i>
                  </span>
                  <span className="title">Calendar</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/chat">
                  <span className="icon-holder">
                    <i className="c-deep-purple-500 ti-comment-alt"></i>
                  </span>
                  <span className="title">Chat</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/charts">
                  <span className="icon-holder">
                    <i className="c-indigo-500 ti-bar-chart"></i>
                  </span>
                  <span className="title">Charts</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className='sidebar-link' to="/admin/forms">
                  <span className="icon-holder">
                    <i className="c-light-blue-500 ti-pencil"></i>
                  </span>
                  <span className="title">Forms</span>
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="sidebar-link" to="/admin/ui">
                  <span className="icon-holder">
                    <i className="c-pink-500 ti-palette"></i>
                  </span>
                  <span className="title">UI Elements</span>
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="dropdown-toggle" to="#">
                  <span className="icon-holder">
                    <i className="c-orange-500 ti-layout-list-thumb"></i>
                  </span>
                  <span className="title">Tables</span>
                  <span className="arrow">
                    <i className="ti-angle-right"></i>
                  </span>
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className='sidebar-link' to="/admin/basic-table">Basic Table</NavLink>
                  </li>
                  <li>
                    <NavLink className='sidebar-link' to="/admin/datatable">Data Table</NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="dropdown-toggle" to="#">
                  <span className="icon-holder">
                    <i className="c-purple-500 ti-map"></i>
                  </span>
                  <span className="title">Maps</span>
                  <span className="arrow">
                    <i className="ti-angle-right"></i>
                  </span>
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/admin/google-maps">Google Map</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/vector-maps">Vector Map</NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="dropdown-toggle" to="#">
                  <span className="icon-holder">
                    <i className="c-red-500 ti-files"></i>
                  </span>
                  <span className="title">Pages</span>
                  <span className="arrow">
                    <i className="ti-angle-right"></i>
                  </span>
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className='sidebar-link' to="/admin/blank">Blank</NavLink>
                  </li>
                  <li>
                    <NavLink className='sidebar-link' to="/admin/404">404</NavLink>
                  </li>
                  <li>
                    <NavLink className='sidebar-link' to="/admin/500">500</NavLink>
                  </li>
                  <li>
                    <NavLink className='sidebar-link' to="/admin/signin">Sign In</NavLink>
                  </li>
                  <li>
                    <NavLink className='sidebar-link' to="/admin/signup">Sign Up</NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="dropdown-toggle" to="#">
                  <span className="icon-holder">
                    <i className="c-teal-500 ti-view-list-alt"></i>
                  </span>
                  <span className="title">Multiple Levels</span>
                  <span className="arrow">
                    <i className="ti-angle-right"></i>
                  </span>
                </NavLink>
                <ul className="dropdown-menu">
                  <li className="nav-item dropdown">
                    <NavLink to="#">
                      <span>Menu Item</span>
                    </NavLink>
                  </li>
                  <li className="nav-item dropdown">
                    <NavLink to="#">
                      <span>Menu Item</span>
                      <span className="arrow">
                        <i className="ti-angle-right"></i>
                      </span>
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink to="#">Menu Item</NavLink>
                      </li>
                      <li>
                        <NavLink to="#">Menu Item</NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="page-container">
          {/* <!-- ### $Topbar ### --> */}
          <div className="header navbar">
            <div className="header-container">
              <ul className="nav-left">
                <li>
                  <NavLink id='sidebar-toggle' className="sidebar-toggle" to="#">
                    <i className="ti-menu"></i>
                  </NavLink>
                </li>
                {/* <li className="search-box">
                            <NavLinkclassName="search-toggle no-pdd-right" href="javascript:void(0);">
                            <i className="search-icon ti-search pdd-right-10"></i>
                            <i className="search-icon-close ti-close pdd-right-10"></i>
                            </NavLink>
                        </li>
                        <li className="search-input">
                            <input className="form-control" type="text" placeholder="Search..."/>
                        </li> */}
              </ul>
              <ul className="nav-right">
                <li className="notifications dropdown">
                  <span id="notificationId" className="counter bgc-red">3</span>
                  <NavLink to="#" className="dropdown-toggle no-after" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="ti-bell"></i>
                  </NavLink>

                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li className="pX-20 pY-15 bdB">
                      <i className="ti-bell pR-10"></i>
                      <span className="fsz-sm fw-600 c-grey-900">Notifications</span>
                    </li>
                    <li>
                      <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/1.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <span>
                                <span className="fw-500">John Doe</span>
                                <span className="c-grey-600">liked your <span className="text-dark">post</span>
                                </span>
                              </span>
                              <p className="m-0">
                                <small className="fsz-xs">5 mins ago</small>
                              </p>
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/2.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <span>
                                <span className="fw-500">Moo Doe</span>
                                <span className="c-grey-600">liked your <span className="text-dark">cover image</span>
                                </span>
                              </span>
                              <p className="m-0">
                                <small className="fsz-xs">7 mins ago</small>
                              </p>
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/3.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <span>
                                <span className="fw-500">Lee Doe</span>
                                <span className="c-grey-600">commented on your <span className="text-dark">video</span>
                                </span>
                              </span>
                              <p className="m-0">
                                <small className="fsz-xs">10 mins ago</small>
                              </p>
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="pX-20 pY-15 ta-c bdT">
                      <span>
                        <NavLink to="#" className="c-grey-600 cH-blue fsz-sm td-n">View All Notifications <i className="ti-angle-right fsz-xs mL-10"></i></NavLink>
                      </span>
                    </li>
                  </ul>
                </li>
                <li className="notifications dropdown">
                  <span className="counter bgc-blue">3</span>
                  <NavLink to="#" className="dropdown-toggle no-after" data-bs-toggle="dropdown">
                    <i className="ti-email"></i>
                  </NavLink>

                  <ul className="dropdown-menu">
                    <li className="pX-20 pY-15 bdB">
                      <i className="ti-email pR-10"></i>
                      <span className="fsz-sm fw-600 c-grey-900">Emails</span>
                    </li>
                    <li>
                      <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/1.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <div>
                                <div className="peers jc-sb fxw-nw mB-5">
                                  <div className="peer">
                                    <p className="fw-500 mB-0">John Doe</p>
                                  </div>
                                  <div className="peer">
                                    <small className="fsz-xs">5 mins ago</small>
                                  </div>
                                </div>
                                <span className="c-grey-600 fsz-sm">
                                  Want to create your own customized data generator for your app...
                                </span>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/2.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <div>
                                <div className="peers jc-sb fxw-nw mB-5">
                                  <div className="peer">
                                    <p className="fw-500 mB-0">Moo Doe</p>
                                  </div>
                                  <div className="peer">
                                    <small className="fsz-xs">15 mins ago</small>
                                  </div>
                                </div>
                                <span className="c-grey-600 fsz-sm">
                                  Want to create your own customized data generator for your app...
                                </span>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="#" className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
                            <div className="peer mR-15">
                              <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/3.jpg" alt="" />
                            </div>
                            <div className="peer peer-greed">
                              <div>
                                <div className="peers jc-sb fxw-nw mB-5">
                                  <div className="peer">
                                    <p className="fw-500 mB-0">Lee Doe</p>
                                  </div>
                                  <div className="peer">
                                    <small className="fsz-xs">25 mins ago</small>
                                  </div>
                                </div>
                                <span className="c-grey-600 fsz-sm">
                                  Want to create your own customized data generator for your app...
                                </span>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="pX-20 pY-15 ta-c bdT">
                      <span>
                        <NavLink to="/admin/email" className="c-grey-600 cH-blue fsz-sm td-n">View All Email <i className="fs-xs ti-angle-right mL-10"></i></NavLink>
                      </span>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <NavLink to="#" className="dropdown-toggle no-after peers fxw-nw ai-c lh-1" data-bs-toggle="dropdown">
                    <div className="peer mR-10">
                      <img className="w-2r bdrs-50p" src="https://randomuser.me/api/portraits/men/10.jpg" alt="" />
                    </div>
                    <div className="peer">
                      <span className="fsz-sm c-grey-900">John Doe</span>
                    </div>
                  </NavLink>
                  <ul className="dropdown-menu fsz-sm">
                    <li>
                      <NavLink to="#" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-settings mR-10"></i>
                        <span>Setting</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="#" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-user mR-10"></i>
                        <span>Profile</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/email" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-email mR-10"></i>
                        <span>Messages</span>
                      </NavLink>
                    </li>
                    <li role="separator" className="divider"></li>
                    <li>
                      <NavLink to="#" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                        <i className="ti-power-off mR-10"></i>
                        <span>Logout</span>
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>


  </div>

}

export default AdminLayoutV2