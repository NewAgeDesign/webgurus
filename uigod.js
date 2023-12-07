/* 
UiGod is a  HTML, JS, CSS and PHP library for creating user interfaces, Building Scalable 
Web Apps Fast, and interacting with various third party utilities out of the box.
We first have to start with the io object which is the main object of the UiGod library.
The io object has the following methods:-
1. io.in() - This method is used to select an element from the DOM and perform an action on it.
2. io.createEl() - This method is used to create an element and append it to the DOM.
3. io.addAtt() - This method is used to add attributes to an element.
4. io.out() - This method is used to output data to the DOM.

*/
const currentScriptUrl = document.currentScript.src;
const isUigodFile = currentScriptUrl && currentScriptUrl.includes('uigod.js');
    
// Get the caller function name
const callerName = (new Error().stack.split('\n')[2] || '').trim().split(' ')[0];
    

io = {
    createEl : function createEl(parentSelector, tagName, attributes, innerHTML) {
        var parentElement = io.in('select',parentSelector);
        if (!parentElement) {
            parentElement = document.body;
        }
        var element = io.addAtt(tagName, attributes);
        parentElement.appendChild(element);
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
    },
    addAtt : function addAtt(tagName, attributes) {
        var element = document.createElement(tagName);
        for (var attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
            return element;
    },
    in : function (param1, param2, param3, param4) {
        // Switch case
        if (param1 === 'select') {
            const selectedElement = document.querySelector(param2);
            if (typeof param3 === 'function' && selectedElement) {
                param3.call(selectedElement); 
            }
            if(!param3){
                return selectedElement;
            }
            return selectedElement;
        }if (param1 === 'pick') {
            const elements = document.querySelectorAll(param2);
            if (typeof param3 === 'number' && typeof param4 === 'function' && elements.length >= param3) {
                const selectedElement = elements[param3 - 1];
                param4.call(selectedElement);
                return selectedElement;
            }
            else if(!param4){
                return document.querySelectorAll(param2)[param3 - 1];
            }
        }if (param1 === "all") {
            const elements = document.querySelectorAll(param2);
            
            if (typeof param3 === 'function' && elements.length > 0) {
                elements.forEach(function(param2) {
                    param3.call(param2); // Execute the provided function on each element
                });
                return elements;
            }
        }if(param1 == "getValue") {
            const myElement = document.querySelector(param2);
            if(myElement.tagName.toLowerCase() === "input"){
                return myElement.value;
            }else{
                return myElement.textContent;
            }
        }if (param1 === "getURL") {
            const currentUrl = window.location.href;
        
            if (currentUrl.includes(param2) && typeof param3 === "function") {
                param3.call();
            } else {
                io.out("bad", "Your String is not in the URL, please debug your Links and try again.");
            }
        }if (param1 === "copy"){
            document.querySelectorAll('[copy]').forEach(function (copyElement) {
                if (copyElement.hasAttribute('copy')) {
                    const textToCopy = copyElement.getAttribute('copy').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const originalText = copyElement.textContent; // Store the original text
        
                    copyElement.addEventListener('click', function () {
                        navigator.clipboard.writeText(textToCopy)
                            .then(function () {
                                console.log('Text successfully copied to clipboard:', textToCopy);
        
                                // Add a CSS class to smoothly transition the text change
                                copyElement.classList.add('copied-success');
        
                                // Change the text to "Copied successfully"
                                copyElement.textContent = 'Copied successfully';
        
                                // Revert to the original text after 3 seconds
                                setTimeout(function () {
                                    copyElement.textContent = originalText;
                                    // Remove the CSS class to reverse the transition
                                    copyElement.classList.remove('copied-success');
                                }, 3000); // 3 seconds in milliseconds
                            })
                            .catch(function (err) {
                                console.error('Unable to copy text: ', err);
                            });
                    });
                }
            });
        }
    },
    out: function (ocase, element, value) {
        if (ocase === "write") {
            document.write(element);
        } else if (ocase === "log") {
            console.log(
                '%c' + element,
                'color: #f4f4f4; background: #f4f4f427; padding: 5px 10px; border-radius: 5px; border: 1pt solid #f4f4f4; font-weight: 600; border-radius: 50pt;',
            );
        } else if (ocase === "bad") {
            console.error(
                '%c' + element,
                'color: #fd7d7d; background: #ff4a4a46; padding: 5px 10px; border-radius: 5px; border: 1pt solid #ff5d5d;  font-weight: 600; border-radius: 50pt;',
            );
        } else if (ocase === "standby") {
            console.warn(
                '%c' + element,
                'color: #ffcf4a; background: #ffcf4a46; padding: 5px 10px; border-radius: 5px; border: 1pt solid #ffcf4a;  font-weight: 600; border-radius: 50pt;',
            );
        } else if (ocase === "notify") {
            console.info(
                '%c' + element,
                'color: #8fd2ff; background: #4ab7ff46; padding: 5px 10px; border-radius: 5px; border: 1pt solid #8fd2ff;  font-weight: 600; border-radius: 50pt;',
            );
        } else if (ocase === "success") {
            console.info(
                '%c' + element,
                'color: #7dfd7d; background: #4aff4a46; padding: 5px 10px; border-radius: 5px; border: 1pt solid #5dff5d;  font-weight: 600; border-radius: 50pt;',
            );
        } else if (ocase === "printPage") {
            return print();
        } else if (ocase === "html") {
            return document.querySelector(element).innerHTML = value;
        } else if (ocase === "text") {
            return document.querySelector(element).textContent = value;
        } else if (ocase === "setValue") {
            return document.querySelector(element).value = value;
        } else if (ocase === "code") {
            // Select all code[type] and pre[type] elements
        io.in('all','code[type], pre[type]').forEach(function (codeElement) {
            // Check if there's a type attribute
            if (codeElement.hasAttribute('type')) {
                // Create the .bar and .code spans
                const barSpan = io.createElAtt('span', { class: 'bar' });
                const codeSpan = io.createElAtt('span', { class: 'code' });
                
                // Create the type span and copy button
                if (barSpan) {
                    const typeSpan = document.createElement('h6');
                    typeSpan.textContent = codeElement.getAttribute('type');
                    const copyButton = document.createElement('button');
                    copyButton.classList.add('btn');
                    copyButton.textContent = 'Copy';
                    copyButton.addEventListener('click', function () {
                        // Copy code to clipboard logic here
                        // ...
                    });
                    
                    // Append typeSpan and copyButton to the .bar span
                    barSpan.appendChild(typeSpan);
                    barSpan.appendChild(copyButton);
                }
                
                // Get the code content and escape HTML tags
                // Get the code content, preserve formatting, and handle line breaks
                const codeContent = codeElement.innerHTML;
                const lines = codeContent.split('\n');
                const spaceAtBeginning = lines[0].search(/\S|$/); // Find the index of the first non-space character or the end of line

                // Process each line
                const formattedLines = lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    const lineContent = trimmedLine.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const spaces = Array(spaceAtBeginning + 1).join('&nbsp;'); // Create the preserved spaces

                    // Add newline escape clause to all lines except the last one
                    const lineEnding = index < lines.length - 1 ? '<br>' : '';

                    return `${spaces}${lineContent}${lineEnding}`;
                });

                // Set the escaped and formatted content
                codeSpan.innerHTML = formattedLines.join('\n');
                
                // Append .bar and .code spans to the codeElement
                codeElement.appendChild(barSpan);
                codeElement.appendChild(codeSpan);
    
                // Hide elements within code[type] and pre[type] except .bar, .code, and their descendants
                io.in('select','code[type] *, pre[type] *', codeElement).forEach(function (element) {
                    if (!element.classList.contains('bar') && !element.classList.contains('code') && !element.closest('.bar') && !element.closest('.code')) {
                        element.style.display = 'none';
                    }
                });
            } else {
                // No type attribute, only escape HTML tags
                const codeContent = codeElement.innerHTML;
                const escapedContent = codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                codeElement.innerHTML = escapedContent;
            }
        });
        }
    }
    
}
io.in('event', 'DOMContentLoaded', function () {
    io.in('copy');
});

document.addEventListener('DOMContentLoaded', function () {
    
// select all the elements in hero
const slide = document.querySelectorAll('.hero li');
const bottom = document.querySelectorAll('.bottom li');
// set them in an array
const slideArray = Array.from(slide);
const bottomArray = Array.from(bottom);
// set the index of the current slide
let currentSlide = 0;
let currentBottom = 0;
// get the index of the whole array
const slideLength = slideArray.length;
const bottomLength = bottomArray.length;

// Function to display the current slide and hide others
function displaySlide() {
    for (let i = 0; i < slideLength; i++) {
        if (i !== currentSlide) {
            slideArray[i].style.opacity = '0';
        }
        else {
            slideArray[i].style.opacity = '1';
            slideArray[i].querySelector('h2, p').style.zIndex = '4';
            
        }
    }
}

function displayBottom() {
    for (let i = 0; i < bottomLength; i++) {
        if (i !== currentBottom) {
            bottomArray[i].style.opacity = '0';
        }
        else {
            bottomArray[i].style.opacity = '1';
            bottomArray[i].querySelector('h2, p').style.zIndex = '4';
            
        }
    }
}

// Display the initial slide
displaySlide();
displayBottom();

// Move to the next slide every 5 seconds
setInterval(() => {
    // Increment currentSlide, wrapping back to 0 if it exceeds the number of slides
    currentSlide = (currentSlide + 1) % slideLength;
    displaySlide();
}, 5000);

setInterval(() => {
    // Increment currentSlide, wrapping back to 0 if it exceeds the number of slides
    currentBottom = (currentBottom + 1) % bottomLength;
    displayBottom();
}, 5000);
});

io.createEl('head', 'link', { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Flex:opsz,wght@8..144,100;8..144,200;8..144,300;8..144,400;8..144,500;8..144,600;8..144,700;8..144,800;8..144,900;8..144,1000&display=swap"});
io.createEl('head', 'link', { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"});
io.createEl('head', 'link', { rel: "preconnect", href: "https://fonts.googleapis.com"});
io.createEl('head', 'link', { rel: "stylesheet", type: "text/css", href: "uigod.css"});
io.createEl('head', 'link', { rel: "preconnect", href: "https://fonts.gstatic.com"});