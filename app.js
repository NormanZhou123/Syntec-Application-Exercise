
window.onload = function () {
    var employees = [];
    // order by first name by default
    var orderByStr = "firstName";
    var count = 10;
    var draggedElement = null;
    // has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; 
    const url = 'https://emplistapi-258220.appspot.com/';
    init();

    // Initialize function
    function init() {
        fetch(proxyurl + url, {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then((data) => {
            //change employees to object
            data.forEach(function (item) {
                var employee = new Employee(item.name.first, item.name.last, item.jobTitle, item.photoURL);
                // push objects into array
                employees.push(employee);
            });
            // reload
            loadData();
        });
    }

    //load the data that need to be displayed
    function loadData() {
        // sorting
        employees.sort((employee1, employee2) => employee1[orderByStr].localeCompare(employee2[orderByStr]));

        var employeeStr = '';
        // card load count
        var newCount = 0;
        if (count > employees.length) {
            newCount = employees.length;
        } else {
            newCount = count;
        }
        for (var i = 0; i < newCount; i++) {
            if (employees[i].photoURL == null) {
                employees[i].photoURL = 'image/default.jpg';
            }
            if (employees[i].jobTitle == null){
                employees[i].jobTitle = ' '
            }
            employeeStr += `
            <div class="box" ondragover="dragOver(event)" ondrop="dragDrop(this)">
                <article class="media" draggable="true" ondragstart="dragStart(this)" ondragend="dragEnd(this)">
                    <div class="media-left">
                        <figure class="image is-64x64">
                            <img class="myImg" src="${employees[i].photoURL}" "alt="Image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <div class="content">
                            <p>
                            <strong>${employees[i].firstName} ${employees[i].lastName}</strong>
                            <br>
                            <p>${employees[i].jobTitle}</p>
                            </p>
                        </div>
                    </div>
                </article>
            </div>
            `
        }
        employeeStr += '<button class="button is-primary" id="more">Load More</button><button class="button is-link buttonRight" id="open">+ Add Employee</button>';
        document.getElementById("content").innerHTML = employeeStr;

        // Open modal
        document.getElementById("open").addEventListener("click", function () {
            var reds = document.getElementsByClassName("red");
            for (var i = 0; i < reds.length; i++) {
                reds[i].style.display = "none";
            }
            document.getElementById("first").value = "";
            document.getElementById("last").value = "";
            document.getElementById("jobTitle").value = "";
            document.getElementById("photoURL").value = "";
            document.getElementById("modal-ter").classList.add("is-active");
        });
        // Close modal
        document.getElementById("close").addEventListener("click", function () {
            document.getElementById("modal-ter").classList.remove("is-active");
        });
        // Close modal
        document.getElementById("close1").addEventListener("click", function () {
            document.getElementById("modal-ter").classList.remove("is-active");
        });
        // click to load more
        document.getElementById("more").addEventListener("click", function () {
            count += 5;
            loadData();
        });
    }

    // Click to save
    document.getElementById("save").addEventListener("click", function () {
        var employee = new Employee();
        var isVerify = true;
        employee.firstName = document.getElementById("first").value;
        employee.lastName = document.getElementById("last").value;
        employee.jobTitle = document.getElementById("jobTitle").value;
        employee.photoURL = document.getElementById("photoURL").value;
        var reds = document.getElementsByClassName("red");
        for (var i = 0; i < reds.length; i++) {
            reds[i].style.display = "none";
        }
        if (employee.firstName == "") {
            document.getElementsByClassName("firstNameWarn")[0].style.display = "block";
            isVerify = false;
        }
        if (employee.lastName == "") {
            document.getElementsByClassName("lastNameWarn")[0].style.display = "block";
            isVerify = false;
        }
        if (employee.jobTitle == "") {
            document.getElementsByClassName("jobTitleWarn")[0].style.display = "block";
            isVerify = false;
        }
        if (employee.photoURL == "") {
            employee.photoURL = "image/default.jpg";
        }
        var onlyEmployee = employees.filter(o => o.firstName == employee.firstName && o.lastName == employee.lastName && o.jobTitle == employee.jobTitle);

        if (onlyEmployee.length > 0) {
            document.getElementsByClassName("only")[0].style.display = "block";
            isVerify = false;
        }

        // Add verified data to the list
        if (isVerify) {
            document.getElementsByClassName("green")[0].style.display = "block";
            employee.photoURL = "image/default.jpg";
            employees.push(employee);
            loadData();
            setTimeout(function () {
                document.getElementById("modal-ter").classList.remove("is-active");
            }, 1000);
        }
        let formData = {
            "name": {
              "first": employee.firstName,
              "last": employee.lastName
            },
            "jobTitle": employee.jobTitle,
            "photoURL": employee.photoURL
          }
        console.log(formData);
        return formData;
    });

    // Sorting drawer switch
    document.getElementById("order").addEventListener("change", function () {
        var orderStr = document.getElementById("order").value;
        if (orderStr == "0") {
            orderByStr = "firstName";
        } else {
            orderByStr = "lastName";
        }
        loadData();
    });

    //Employee Class
    class Employee {
        constructor(first, last, jobTitle, photoURL) {
            this.firstName = first;
            this.lastName = last;
            this.jobTitle = jobTitle;
            this.photoURL = photoURL;
        }
        getFirstName(){
            return this.firstName
        }
        getLastName(){
            return this.lastName
        }
        getJobTitle(){
            if (this.jobTitle == null){
                return null;
            }
            else{
                return this.jobTitle;
            }
        }
        getPhotoURL(){
            if (this.photoURL == null){
                return null;
            }
            else{
                return this.photoURL;
            }
        }
    }
}

// Drag & Drop
function dragStart(domEl) {
    draggedElement = domEl;
    setTimeout(() => (domEl.style.visibility = "hidden"), 0);
}

function dragEnd(domEl) {
    domEl.style.visibility = "visible";
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(domEl) {
// swap dom elements
    swapDOMElments(domEl, draggedElement.parentNode); 
}

function swapDOMElments(domEl1, domEl2) {
    var parent2 = domEl2.parentNode;
    var next2 = domEl2.nextSibling;
    if (next2 === domEl1) {
        parent2.insertBefore(domEl1, domEl2);
    } else {
        domEl1.parentNode.insertBefore(domEl2, domEl1);
        if (next2) {
        parent2.insertBefore(domEl1, next2);
        } else {
        parent2.appendChild(domEl1);
        }
    }
}





