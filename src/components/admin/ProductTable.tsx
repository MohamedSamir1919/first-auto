// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaCaretDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import ProductDeatails from "../ProductDeatails";
import Cookies from 'js-cookie';

type IItem = {
  _id: string;
  title: string;
  description: string;
  stock: number;
  slug: string;
  img: string;
  // colors: string[];
  // size: string[];
  published: boolean;
  price: number;
  category: string;
};
type FiltersType = {
  title: string;
  stock: string;
  size: string;
  colors: string;
  price: string;
  slug: string;
};
type attributesType = {
  name: string;
  value: string[] | number[];
  slug: string;
};

type Props = {};

const ProductTable = (props: Props) => {
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<IItem[]>([]);
  const [slugs, setSlugs] = useState([]);
  const [categories, setCategories] = useState();
  let [details, setDetails] = useState();
  const [files, setFiles] = useState([]); // Array for multiple files
  const [confirmed, setConfirmed] = useState("");
  const handleMultipleFiles = (e) => {
    // Convert FileList to Array
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    setConfirmed("Uploading...");
    let successCount = 0;

    // Upload images one by one to avoid 413 Payload Too Large error
    for (const file of files) {
      const data = new FormData();
      data.append('img', file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/products/upload/images`,
          data,
          { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
        );

        if (response.status === 200) {
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }

    if (successCount === files.length) {
      setConfirmed("All images uploaded successfully");
    } else {
      setConfirmed(`Uploaded ${successCount} of ${files.length} images`);
    }
    setTimeout(() => { setConfirmed("") }, 3000);
  };
  const getCategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/category`);
    if (res.status == 200) {
      setCategories(res.data);
    } else {

    }
  };

  const getSlugs = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/slug`)
    if (res.status == 200) {
      setSlugs(res.data);
    }
  }
  useEffect(() => {

    getSlugs()
    getCategories();
  }, [])
  // ***********************************
  const [filters, setFilters] = useState<FiltersType>({
    title: "",
    slug: "",
    category: "",

    stock: "",
    published: true,
    price: "",
  });
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IItem[]>([]);

  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [slug, setSlug] = useState("");
  let [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [deatailsIndex, setDeatailsIndex] = useState(-1);

  const [publishedProducts, setPublishedProducts] = useState("all");

  // PUBLISH PRODUCT METHOD
  const publishedPro = async (id, update) => {

    const res = await axios.post(`${import.meta.env.VITE_SERVER}/products/publish/${id}`, update
      , { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
    )
    if (res.status == 200) {
      setTimeout(() => {
        getProducts();
      }, 500)
    }
  }



  // PRODUCTS ***************
  const [products, setProducts] = useState<IItem[]>([]);

  const getProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/products`);
    if (res.status == 200) {
      setProducts(res.data);
      getSlugs();
    } else {

    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  // PRODUCTS END ************************


  // DATE FILTER ****************

  const [beginDate, setBeginDate] = useState();

  const [endDate, setEndDate] = useState();
  const [dateFProducts, setDateFProducts] = useState<IItem[]>([]);

  useEffect(() => {
    setDateFProducts(
      filteredProducts.filter((product) => {
        // Convert input dates to Date objects
        const d = Date.now();
        const start = new Date(
          beginDate
            ? beginDate
            : Date.parse(`${new Date(d).getFullYear()}-01-01T00:00:00`)
        );
        const end = new Date(
          endDate
            ? endDate
            : Date.parse(
              `${new Date(d).getFullYear()}-${new Date(d).getMonth() > 8
                ? new Date(d).getMonth() + 1
                : `0${new Date(d).getMonth() + 1}`
              }-${new Date(d).getDate() > 9
                ? new Date(d).getDate() + 1
                : `0${new Date(d).getDate() + 1}`
              }T00:00:00`
            )
        );

        // Filter the products

        const createdDate = new Date(product.createdAt);
        const updatedAt = new Date(product.updatedAt);


        // Check if either date is within the range
        return (
          (createdDate >= start && createdDate <= end) ||
          (updatedAt >= start && updatedAt <= end)
        );
      })
    );
  }, [filteredProducts, beginDate, endDate]);

  // ^ DATE FILTER ^

  const deleteSelected = async () => {

    selectedProducts.forEach(async (s) => {

      const res = await axios.post(`${import.meta.env.VITE_SERVER}/products/del/${s}`, {},
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
      if (res.status == 200) {
        console.log(s, "Deleted")
      }
      else {
        console.log(res.data)
      }
    })
    setTimeout(() => {
      getProducts();

    }, 3000)
  }


  useEffect(() => {
    try {

      setFilteredProducts(
        products.filter((product) => {
          return Object.entries(filters).every(([key, value]: [string, string]) =>
          // Change this condition based on your requirement ==
          {
            if (key == 'slug' && value != "") {
              if (value != "") {

                return slugs?.filter((s) => (s.code.includes(value)))?.some((s) => (s.product == product?._id))
              }
            }
            else if (key == 'category' && value != "") {

              if (value != "") return categories?.filter((c) => (c.name.includes(value))).some((c) => (c._id == slugs?.filter((s) => s._id == product.slug)[0]?.category))

            }


            else if (typeof product[key] == "string" && product[key] != "") {
              return product[key].includes(value) ? product : false;
            } else if (typeof product[key] == "string" && value == "") {
              return true;
            } else if (typeof product[key] == "number") {
              if (value == "") {
                return product;
              } else return product[key] == parseInt(value);
            } else {
              return true;
            }
          }
          );
        }).sort((a, b) => (a.createdAt > b.createdAt || a.updatedAt > b.updatedAt) ? -1 : 1)
      );
    } catch (err) {
      console.log(err)
    }
  }, [filters, products]);
  useEffect(() => {
    if (selectedProducts.length == 1) {
    } else if (
      document.getElementById("title") &&
      document.getElementById("slug") &&
      document.getElementById("category") &&
      document.getElementById("stock") &&
      // document.getElementById("colors") &&
      document.getElementById("sizes") &&
      document.getElementById("price")
    ) {
      document.getElementById("title").value = "";
      document.getElementById("slug").value = "";
      document.getElementById("category").value = "";
      document.getElementById("stock").value = "";
      // document.getElementById("colors").value = "";
      document.getElementById("sizes").value = "";
      document.getElementById("price").value = "";
    }
  }, [selectedProducts]);

  const downloadExcel = async () => {
    // const myJSON: any = JSON.stringify(products)
    const myHeader = [
      "_id",
      "title",
      "category",
      "description",
      "stock",
      "slug",
      "img",
      // "colors",
      // "size",
      "price",
    ];
    const refixProducts = products.map((p, index) =>
      attributes?.map((ar) =>
        Object.assign(p, {
          [ar.name]: `${ar.value.map((v, inx) =>
            inx + 1 == ar.value.length ? ` ${v}` : `${v},`
          )}`,
        })
      )
    );
    const worksheet = XLSX.utils.json_to_sheet(refixProducts, {
      header: myHeader,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    await XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  // BULK UPLOAD
  const handleFileChange = (e: Event) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const reader = new FileReader();
    const exfile = document.getElementById("excelFile");
    if (!exfile || !exfile.files[0]) {
      setMessage("Browse First");
      setTimeout(() => {
        setMessage("")
      }, 3000)
      return;
    }
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const token = Cookies.get("token")
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const dataFixed = jsonData?.reduce((d, curr) => {
        // Fix mapping from Excel headers (size/colors) to model keys
        d = [...d, { ...curr, sizes: curr.size, colors: curr.colors }]
        return d
      }, [])
      console.log(dataFixed)
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/products/many`,
        dataFixed,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (res.status == 200) {
        setMessage("Uploaded Done");
        setTimeout(() => {
          setMessage("");
          getProducts()
          getSlugs();
          getCategories()
        }, 3000);
        console.log(res.data)
      }
      else {
        setTimeout(() => {
          setMessage("there is somthing wrong");
          getProducts()
        }, 3000);
      }

    };
    reader.readAsArrayBuffer(exfile.files[0]);
  };
  return (
    <div className="w-full mt-[20px] relative ml-[200px] md:ml-0">
      <div className="w-full flex justify-between items-center"></div>
      <div className="w-full flex flex-col">
        <div className="w-[90%] flex mr-[100px] justify-between">
          <div className="flex ml-[200px] md:ml-0  justify-start">
            <div
              onClick={() => setPublishedProducts("all")}

              className="flex">
              <h6 className="text-gray-900 cursor-pointer font-black">All</h6>
              <h6 className="font-bold text-gray-500">({dateFProducts.length})</h6>
            </div>
            |
            <div
              onClick={() => setPublishedProducts("published")}
              className="flex  ml-1">
              <h6 className="cursor-pointer text-gray-900 font-black">
                Published
              </h6>
              <h6 className="font-bold text-gray-500">({dateFProducts.filter((dfp) => {
                return dfp.published
              }
              ).length})</h6>
            </div>
            |
            <div
              onClick={() => setPublishedProducts("draft")}

              className="flex">
              <h6 className="cursor-pointer text-gray-900 font-black">Draft</h6>
              <h6 className="font-bold text-gray-500">({dateFProducts.filter((dfp) => {
                return !dfp.published
              }
              ).length})</h6>
            </div>
          </div>
          <div className="flex w-[50%] justify-end">
            <div
              onClick={() => downloadExcel()}
              className="w-[100px] m-2 cursor-pointer bg-gradient-to-bl rounded from-green-100 to-green-300"
            >
              Download
            </div>
            <div className="flex flex-ccol">
              <input
                onChange={(e) => {
                  const el = document.getElementById("fileName");

                  setMessage(e.target.files[0].name);
                }}
                type="file"
                id="excelFile"
                name="upload"
                className={`align-middle m-2 bg-gradient-to-tr  from-blue-100 to-blue-300 rounded-md px-2`}
              // onChange={(e) => handleFileUpload(e)}
              />
              <p id="fileName" className=""></p>
              <p className="text-red-500">{message}</p>
              <button
                className="w-[100px] m-2 cursor-pointer bg-gradient-to-bl rounded from-green-100 to-green-300"
                onClick={() => {
                  handleFileUpload();
                }}
              >
                upload
              </button>
            </div>
          </div>
        </div>

        <div className="w-[90%] flex justify-between">
          <div className="ml-[200px] md:ml-0 flex justify-start">

            <div className="mr-4">
              <h6 className="font-bold">From</h6>
              <input
                onChange={(e) => {
                  setBeginDate(e.target.value);
                }}
                type="date"
              />
            </div>
            <div className="">
              <h6 className="font-bold">To</h6>
              <input
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                type="date"
              />
            </div>
          </div>
          <div className=" flex justify-end align-bottom items-end">
            <MdKeyboardArrowLeft
              onClick={() => {
                if (page != 1) {
                  setPage(page - 1);
                }
              }}
              className="text-gray-700 cursor-pointer text-[24px] mr-2"
            />

            <div className="flex justify-content align-bottom  items-center">
              {`${page}:${parseInt(dateFProducts.filter((p) => {
                if (publishedProducts == 'all') {
                  return true
                }
                else if (publishedProducts == 'published') {
                  return p.published
                }
                else if (publishedProducts == 'draft') {
                  return !p.published
                }
              }).length / 13 + 1)}
            `}</div>
            <RiArrowRightSLine
              onClick={() => {
                if (parseInt(dateFProducts.filter((p) => {
                  if (publishedProducts == 'all') {
                    return true
                  }
                  else if (publishedProducts == 'published') {
                    return p.published
                  }
                  else if (publishedProducts == 'draft') {
                    return !p.published
                  }
                })?.length / 13) + 1 < page) {
                  setPage(page + 1);
                }
              }}
              className="text-gray-700 cursor-pointer text-[24px] ml-2"
            />
          </div>
        </div>
      </div>
      <table className="md:w-[90%] mt-2 ml-[200px]  -0 mr-[10px] md:ml-0 md:mr-0 md:p-0  w-auto md:w-[500px]  ">
        <thead className="w-full">
          <tr className="flex bg-gradient-to-t from-white to-gray-200">
            <th className="flex   flex-col p-2 items-center">
              <h6 className="font-black">Title</h6>
              <input
                name="title"
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setTitle(e.target.value);
                }}
                id="title"
                className="rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th>
            <th className="flex flex-col   p-2  items-center">
              <h6 className="font-black">Slug</h6>

              <input
                name="slug"
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setSlug(e.target.value);
                }}
                id="slug"
                className="rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th>
            <th className="flex flex-col p-2    items-center">
              <h6 className="font-black">Category</h6>
              <input
                name="category"
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setCategory(e.target.value);
                }}
                id="category"
                className="rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th>
            <th className="flex flex-col   p-2  items-center">
              <h6 className="font-black">Stock</h6>
              <input
                name="stock"
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setStock(e.target.value);
                }}
                id="stock"
                className="rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th>
            <th className="flex flex-col w-[118px]   p-2  items-center">
              <h6 className="font-black">Published</h6>

            </th>
            {/* <th className="flex flex-col   p-2  items-center">
              <h6 className="font-black">Colors</h6>
              <textarea
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setColors(e.target.value);
                }}
                name="colors"
                id="colors"
                className="h-[25px] rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th> */}

            {/* <th className="flex flex-col   p-2  items-center">
              <h6 className="font-black">Sizes</h6>
              <textarea
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setSizes(e.target.value);
                }}
                name="size"
                id="sizes"
                className="h-[25px] rounded-xl w-[100px] bg-gray-400"
                placeholder=""
              />
            </th> */}

            <th className="flex flex-col   p-2  items-center">
              <h6 className="font-black">Price</h6>
              <input
                name="price"
                id="price"
                onChange={(e) => {
                  setFilters({ ...filters, [e.target.name]: e.target.value });
                  setPrice(e.target.value);
                }}
                className="rounded-xl
                      w-[100px] bg-gray-400"
              />
            </th>
            <th className="flex flex-col w-[118px]   p-2  items-center">
              Image
              {/* <input
                id="filee"
                type="file"
                className="w-[118px]"
                onChange={(evt) => {
                  var tgt = evt.target;
                  let files = tgt.files;

                  // FileReader support
                  if (FileReader && files && files.length) {
                    var fr = new FileReader();
                    fr.onload = function () {
                      document.getElementById("outImage").src = fr.result;
                    };
                    fr.readAsDataURL(files[0]);
                  }

                  // Not supported
                  else {
                    // fallback -- perhaps submit the input to an iframe and temporarily store
                    // them on the server until the user's session ends.
                  }
                }}
              />
              <img id="outImage" onClick={(e) => {}} className="w-[200px]" /> */}
            </th>
            <th className="flex flex-col w-[118px]   p-2  items-center">
              <div className="relative">
                {/* <input
                  type="checkbox"
                  id="indexxx"
                  checked={selectedProducts == dateFProducts.filter((p)=>{
                if(publishedProducts == 'all'){
                  return p
                }
                else if (publishedProducts == 'published'){
                  return p.published 
                }
                else if (publishedProducts == 'draft' ){
                  return !p.published
                }
              })}
                  className="rounded-xl bg-gray-400"
                /> */}
                <div
                  className="absolute w-full  h-full
             left-0 top-0 flex 
            justify-center items-center  "
                >
                  <input

                    onChange={() => {
                      if (dateFProducts.every((p) => {

                        if (publishedProducts == 'all') {
                          return selectedProducts.includes(p._id)
                        }
                        else if (publishedProducts == 'published' && p.published) {
                          return selectedProducts.includes(p._id)

                        }
                        else if (publishedProducts == 'draft' && !p.published) {
                          return selectedProducts.includes(p._id)

                        }
                      })) {
                        setSelectedProducts([]);
                      } else {
                        setSelectedProducts(dateFProducts.map((p) => {

                          if (publishedProducts == 'all') {
                            return p._id
                          }
                          else if (publishedProducts == 'published' && p.published) {
                            return p._id
                          }
                          else if (publishedProducts == 'draft' && !p.published) {
                            return p._id
                          }
                        }));
                      }
                    }}
                    type="checkbox"
                  />
                </div>
                <input type="checkbox" checked={selectedProducts.includes(dateFProducts.map((p) => {

                  if (publishedProducts == 'all') {
                    return p._id
                  }
                  else if (publishedProducts == 'published' && p.published) {
                    return p._id
                  }
                  else if (publishedProducts == 'draft' && !p.published) {
                    return p._id
                  }
                }))} />
              </div>
              <div
                onClick={() => deleteSelected()}
                className="px-2 cursor-pointer rounded-lg bg-[red]">
                Del
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {dateFProducts?.filter((p) => {
            if (publishedProducts == 'all') {
              return true
            }
            else if (publishedProducts == 'published') {
              return p.published
            }
            else if (publishedProducts == 'draft') {
              return !p.published
            }
          })?.map((i, index) =>
            index + 1 > 13 * page || index + 1 < 13 * page - 13 ? null : (
              <tr
                onMouseEnter={() => {
                  document.getElementById(`image${index}`).style.display =
                    "flex";
                }}
                onMouseLeave={(e) => {
                  document.getElementById(`image${index}`).style.display =
                    "none";
                }}
                key={index}
                className="flex "
              >
                <td
                  className="relative flex w-[118px]  flex-wrap justify-center
                 flex-col p-2 items-center"
                >
                  <h6 className="font-light">{i?.title}</h6>
                  <div
                    id={`image${index}`}
                    className="absolute z-[10] hidden top-[100%] hover:flex left-0 w-[115px] "
                  >
                    <a href={`${import.meta.env.VITE_SERVER}/images/products/${i?.img}`} target="_blank">
                      <img src={`${i?.img}`} />
                    </a>
                  </div>
                </td>

                <td
                  className="flex w-[118px] relative flex-wrap justify-center
                   flex-col p-2 items-center"
                >
                  <h6 className="font-light">{
                    slugs?.filter((s) => s._id == i.slug)[0]?.code

                  }</h6>

                </td>
                <td className="flex w-[118px]  flex-wrap justify-center   flex-col p-2 items-center">
                  <h6 className="font-light">{
                    categories?.filter((c) => c._id == slugs?.filter((s) => s._id == i.slug)[0]?.category)[0]?.name
                  }</h6>
                </td>
                <td className="flex w-[118px]  flex-wrap justify-center   flex-col p-2 items-center">
                  <h6 className="font-light">{
                    i.stock
                  }</h6>


                </td>


                <td className="flex w-[118px] relative flex-wrap justify-center   flex-col p-2 items-center">
                  <div
                    className="absolute w-full  h-full
             left-0 top-0 flex 
            justify-center items-center opacity-0 "
                  >
                    <input
                      onClick={() => {
                        if (document.getElementById(`indexx${index}`)?.checked) {
                          publishedPro(i._id, { published: false })

                        } else {
                          publishedPro(i._id, { published: true })
                        }
                      }}
                      type="checkbox"
                    />
                  </div>
                  <input
                    type="checkbox"
                    id={`indexx${index}`}
                    checked={
                      i.published
                    }
                    className="rounded-xl bg-gray-400"
                  />
                </td>

                {/* <td className="flex w-[118px]  flex-wrap justify-center   flex-col p-2 items-center">
                  <h6 className="font-light">
                    {i?.colors.map((c, index) =>
                      index == i?.colors.length - 1 ? `${c} ` : `${c}, `
                    )}
                  </h6>
                </td> */}
                {/* <td className="flex w-[118px]   flex-wrap justify-center   flex-col p-2 items-center">
                  <h6 className="font-light">
                    {i?.size.map((s, ind) =>
                      ind == i?.size.length - 1 ? `${s}` : `${s},`
                    )}
                  </h6>
                </td> */}
                <td className="flex w-[118px]  relative flex-wrap    flex-col p-2 items-center">
                  <h6 className="font-light">{i?.price} EGP</h6>
                  <div
                    id={`attributes${index}`}
                    className={`absolute
                     z-[10] ${deatailsIndex == index ? "flex" : "hidden"
                      }  top-[100%]  
                     left-[-100%] w-[230px] h-full `}
                  >
                    <div
                      className="bg-white h-[200px] z-[11] flex  flex-col w-full
                     items-center border-[1px black solid]
                    "
                    >
                      <h6 className="text-red-500">attributes</h6>
                      <button
                        onClick={async () => {
                          if (details.includes(":")) {
                            let add = async () => {
                              const res = await axios.post(`${import.meta.env.VITE_SERVER}/products/edit/${i._id}`, { [details.split(":")[0]]: details.split(":")[1] },
                                { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
                              )

                            }
                            add();
                            setTimeout(() => {
                              getProducts();
                            }, 500)
                          }
                        }}
                        className="px-2 cursor-pointer bg-gradient-to-tl from-green-300 to-green-100" >
                        Add
                      </button>
                      <hr className="w-[200px] h-[.5px] bg-black my-[2px]" />
                      <div className="flex flex-col ">

                        {i.details ? i.details?.map(d => {


                          let [[key, value]] = Object.entries(d)
                          return (<span>
                            {key}:{value}
                          </span>

                          )

                        })
                          : ""
                        }



                      </div>

                      <textarea onChange={(d) => {
                        setDetails(d.target.value)

                      }} className="rounded-md px-2 w-[90%] bg-gray-200"
                        placeholder="arrtibute : value 1, value 2, ..."
                      />

                    </div>
                  </div>
                </td>
                <td
                  className="flex w-[118px]  flex-wrap 
              justify-center   
              flex-col p-2 items-center"
                >
                  <div
                    onClick={() => {
                      deatailsIndex != index
                        ? setDeatailsIndex(index)
                        : setDeatailsIndex(-1);
                    }}
                    className="px-2 cursor-pointer bg-green-500 rounded-md cursor-pointer"
                  >
                    Deatails
                  </div>
                </td>

                <td className="flex w-[118px] relative flex-wrap justify-center   flex-col p-2 items-center">
                  <div
                    className="absolute w-full  h-full
             left-0 top-0 flex 
            justify-center items-center opacity-0 "
                  >
                    <input
                      onChange={(e) => {
                        if (!e.target.checked) {
                          return setSelectedProducts(
                            selectedProducts.filter((item) => item != i._id)
                          );
                        } else {

                          return setSelectedProducts(([...selectedProducts, i._id]));
                        }
                      }}

                      type="checkbox"
                    />
                  </div>
                  <div
                    className=" w-full  h-full
             left-0 top-0 flex 
            justify-center items-center "
                  >
                    <input
                      type="checkbox"
                      id={`index${index}`}
                      checked={
                        selectedProducts?.includes(i._id) ? true : false
                      }
                      className="rounded-xl bg-gray-400"

                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div className="w-full flex flex-wrap justify-center mt-2 items-center">
        {dateFProducts.filter((p) => {
          if (publishedProducts == 'all') {
            return true
          }
          else if (publishedProducts == 'published') {
            return p.published
          }
          else if (publishedProducts == 'draft') {
            return !p.published
          }
        }).map((fp, ind) =>
          ind <= dateFProducts.filter((p) => {
            if (publishedProducts == 'all') {
              return true
            }
            else if (publishedProducts == 'published') {
              return p.published
            }
            else if (publishedProducts == 'draft') {
              return !p.published
            }
          }).length / 13 ? (
            <div
              onClick={() => {
                setPage(ind + 1);
              }}
              className={`${ind + 1 == page
                ? "bg-green-500 mt-2 cursor-default text-yellow-900"
                : "bg-yellow-500  cursor-pointer text-green-900"
                } p-2 font-black
               mx-2 rounded-lg`}
            >
              {ind + 1}
            </div>
          ) : null
        )}
      </div>
      <div className="w-full my-[100px] flex justify-center items-center">
        <input
          className="w-[200px] mr-[10px] bg-gray-200"
          type='file'
          multiple
          accept="image/*"
          onChange={(e) => handleMultipleFiles(e)}
        />
        <button
          onClick={(e) => { handleSubmit(e) }}
          className="w-[150px] cursor-pointer ml-[10px]  bg-gradient-to-r from-green-300 to-green-600">
          Upload Images
        </button>
        {confirmed != "" ? confirmed : false}
      </div>
    </div>
  );
};

export default ProductTable;
