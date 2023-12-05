//document.addEventListener('DOMContentLoaded', function() {
var newDataBtn = document.querySelector('.addPengumuman button');
var darkBg = document.querySelector('.dark_bg');
var popupForm = document.querySelector('.popup');
var crossBtn = document.querySelector('.closeButton');
var submitBtn = document.querySelector('.submitBtn');
var modalTitle = document.querySelector('.modalTitle');
var popupFooter = document.querySelector('.popupFooter');
var imgInput = document.querySelector('.img');
var imgHolder = document.querySelector('.imgholder');
var form = document.querySelector('form');
var formInputFields = document.querySelectorAll('form input');
var uploadimg = document.getElementById('uploadimg');
var titleAnnouncement = document.getElementById('titleAnnouncement');
var descAnnouncement = document.getElementById('descAnnouncement');
var sdate = document.getElementById('sdate');
var entries = document.querySelector('.showEntries');
var paginationBtn = document.querySelector('.pagination button');
var tabSize = document.getElementById('table-size');
var pengumumanInfo = document.querySelector('.pengumumanInfo');
var table = document.querySelector("table");
var filterData = document.getElementById("search");




let originalData = localStorage.getItem('dataPengumuman') ? JSON.parse(localStorage.getItem('dataPengumuman')) : []
let getData = [...originalData]

let isEdit = false,
    editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()



newDataBtn.addEventListener('click', function() {
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Isi Form Pengumuman"
    popupFooter.style.display = "block"
    imgInput.src = "./img/image-solid.png"

    darkBg.classList.add('active');
    popupForm.classList.add('active');
})

crossBtn.addEventListener('click', function() {
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

uploadimg.onchange = function() {
    if (uploadimg.files[0].size < 1000000) { // 1MB = 1000000
        var fileReader = new FileReader()

        fileReader.onload = function(e) {
            var imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(uploadimg.files[0])
    } else {
        alert("This file is too large!")
    }

}

function preLoadCalculations() {
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if ((arrayLength % tableSize) > 0) {
        maxIndex++
    }
}

function displayIndexBtn() {
    preLoadCalculations()
    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""
    pagination.innerHTML = '<button onclick="prev()" class="prev">prev</button>'

    for (let i = 1; i <= maxIndex; i++) {
        pagination.innerHTML += '<button onclick="paginationBtn(' + i + ') index="' + i + '">' + i + '</button>'
    }
    pagination.innerHTML += '<button onclick="next()" class="next">next</button>'

    highlightIndexBtn()
}

function highlightIndexBtn() {
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if (endIndex > arrayLength) {
        endIndex = arrayLength
    }

    if (maxIndex >= 2) {
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if (btn.getAttribute('index') === currentIndex.toString()) {
            btn.classList.add('active')
        }
    })


    showInfo()
}

function showInfo() {
    document.querySelectorAll(".pengumumanDetails").forEach(info => info.remove())

    var tab_start = startIndex - 1
    var tab_end = endIndex

    if (getData.length > 0) {
        for (var i = tab_start; i < tab_end; i++) {
            var pengumuman = getData[i]


            if (pengumuman) {
                let createElement = `<tr class = "pengumumanDetails">
                    <td>${i+1}</td>
                    <td>${pengumuman.titleAnnouncement}</td>
                    <td>${pengumuman.descAnnouncement}</td>
                    <td><img src="${pengumuman.picture}" alt="" width="40" height="40"></td>
                    <td>${pengumuman.sdate}</td>
                    <td>
                        <button onclick="readInfo('${pengumuman.picture}','${pengumuman.titleAnnouncement}','${pengumuman.descAnnouncement}','${pengumuman.sdate}')"><img src="./img/eye-solid.svg" alt="" class="imgbtnview"></button>
    
                        <button onclick="editInfo('${i}', '${pengumuman.picture}', '${pengumuman.titleAnnouncement}', '${pengumuman.descAnnouncement}', '${pengumuman.sdate}')"><img src="./img/pen-to-square-solid.svg" alt="" class="imgbtnedit"></button>
    
    
                        <button onclick = "deleteInfo(${i})"><img src="./img/trash-can-solid.svg" alt="" class="imgbtndelete"></button>
                    </td>
                </tr>`

                pengumumanInfo.innerHTML += createElement
                table.style.minWidth = "1000px"
            }
        }
    } else {
        pengumumanInfo.innerHTML = `<tr class="pengumumanDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`
        table.style.minWidth = "1000px"
    }
}

showInfo()

function readInfo(pic, TitleAnnouncement, DescAnnouncement, Sdate) {

    imgInput.src = pic
    titleAnnouncement.value = TitleAnnouncement
    descAnnouncement.value = DescAnnouncement
    sdate.value = Sdate


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "none"
    modalTitle.innerHTML = "Data Pengumuman"
    formInputFields.forEach(input => {
        input.disabled = true
    })


    imgHolder.style.pointerEvents = "none"
}

function editInfo(id, pic, TitleAnnouncement, DescAnnouncement, Sdate) {
    isEdit = true
    editId = id

    // Find the index of the item to edit in the original data based on id
    const originalIndex = originalData.findIndex(item => item.id === id)

    // Update the original data
    originalData[originalIndex] = {
        id: id,
        picture: pic,
        titleAnnouncement: titleAnnouncement,
        descAnnouncement: descAnnouncement,
        sdate: sdate,
    }

    imgInput.src = pic
    titleAnnouncement.value = TitleAnnouncement
    descAnnouncement.value = DescAnnouncement
    sdate.value = Sdate


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "block"
    modalTitle.innerHTML = "Update the Form"
    submitBtn.innerHTML = "Update"
    formInputFields.forEach(input => {
        input.disabled = false
    })


    imgHolder.style.pointerEvents = "auto"
}

function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        originalData.splice(index, 1);
        localStorage.setItem("dataPengumuman", JSON.stringify(originalData));

        // Update getData after deleting the record
        getData = [...originalData];

        preLoadCalculations()

        if (getData.length === 0) {
            currentIndex = 1
            startIndex = 1
            endIndex = 0
        } else if (currentIndex > maxIndex) {
            currentIndex = maxIndex
        }

        showInfo()
        highlightIndexBtn()
        displayIndexBtn()

        var nextBtn = document.querySelector('.next')
        var prevBtn = document.querySelector('.prev')

        if (Math.floor(maxIndex) > currentIndex) {
            nextBtn.classList.add("act")
        } else {
            nextBtn.classList.remove("act")
        }


        if (currentIndex > 1) {
            prevBtn.classList.add('act')
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const information = {
        id: Date.now(),
        picture: imgInput.src == undefined ? "./img/image-solid.png" : imgInput.src,
        titleAnnouncement: titleAnnouncement.value,
        descAnnouncement: descAnnouncement.value,
        sdate: sdate.value

    }

    if (!isEdit) {
        originalData.unshift(information)

    } else {
        originalData[editId] = information
    }

    getData = [...originalData]
    localStorage.setItem('dataPengumuman', JSON.stringify(originalData))

    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Isi Form Pengumuman"
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    highlightIndexBtn()
    displayIndexBtn()
    showInfo()

    var nextBtn = document.querySelector(".next")
    var prevBtn = document.querySelector(".prev")
    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act")
    } else {
        nextBtn.classList.remove("act")
    }


    if (currentIndex > 1) {
        prevBtn.classList.add("act")
    }

})

function next() {
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if (currentIndex <= maxIndex - 1) {
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if (currentIndex > maxIndex - 1) {
        nextBtn.classList.remove("act")
    }
}


function prev() {
    var prevBtn = document.querySelector('.prev')

    if (currentIndex > 1) {
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if (currentIndex < 2) {
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i) {
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if (currentIndex > maxIndex - 1) {
        nextBtn.classList.remove('act')
    } else {
        nextBtn.classList.add("act")
    }


    if (currentIndex > 1) {
        prevBtn.classList.add("act")
    }

    if (currentIndex < 2) {
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', () => {
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", () => {
    const searchTerm = filterData.value.toLowerCase().trim()

    if (searchTerm !== "") {

        const filteredData = originalData.filter((item) => {

            const titleAn = item.titleAnnouncement.toLowerCase()

            return (
                titleAn.includes(searchTerm)
            )
        })

        // Update the current data with filtered data
        getData = filteredData
    } else {
        getData = JSON.parse(localStorage.getItem('dataPengumuman')) || []
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})

displayIndexBtn()
    //});