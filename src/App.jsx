    import React, { useEffect, useState } from "react";
    import "./home.css";

    function Home() {
      const rotateArray = (arr, count) => {
        const rotatedArray = [...arr];
        for (let i = 0; i < Math.abs(count); i++) {
          if (count > 0) {
            // Rotate array to the right
            const lastElement = rotatedArray.pop();
            rotatedArray.unshift(lastElement);
          } else {
            // Rotate array to the left
            const firstElement = rotatedArray.shift();
            rotatedArray.push(firstElement);
          }
        }
        return rotatedArray;
      };

      
      const [initialDate, setInitialDate] = useState(
        new Date("Tue Feb 20 2024 23:59:08 GMT+0200"),
      );
     
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() );
      const daysUntilTuesday = (7 - nextWeekDate.getDay() + 2) % 7; // Adding 2 to account for shifting Tuesday
      nextWeekDate.setDate(nextWeekDate.getDate() + daysUntilTuesday);
      
      // Update the initial date to the Tuesday of the next week
      const [currentDate, setCurrentDate] = useState(nextWeekDate);
      

      const bibleBooksAbbreviations = [
        "GEN",
        "EXO",
        "LEV",
        "NUM",
        "DEU",
        "JOS",
        "JDG",
        "RUT",
        "1SA",
        "2SA",
        "1KI",
        "2KI",
        "1CH",
        "2CH",
        "EZR",
        "NEH",
        "EST",
        "JOB",
        "PSA",
        "PRO",
        "ECC",
        "SNG",
        "ISA",
        "JER",
        "LAM",
        "EZK",
        "DAN",
        "HOS",
        "JOL",
        "AMO",
        "OBA",
        "JON",
        "MIC",
        "NAM",
        "HAB",
        "ZEP",
        "HAG",
        "ZEC",
        "MAL",
        "MAT",
        "MRK",
        "LUK",
        "JHN",
        "ACT",
        "ROM",
        "1CO",
        "2CO",
        "GAL",
        "EPH",
        "PHI",
        "COL",
        "1TH",
        "2TH",
        "1TI",
        "2TI",
        "TIT",
        "PHM",
        "HEB",
        "JAS",
        "1PE",
        "2PE",
        "1JN",
        "2JN",
        "3JN",
        "JUD",
        "REV",
      ];
      
      const [week, setWeek] = useState("This");
      const [cweek, setcWeek] = useState(1);
      const [errorMessage, setErrorMessage] = useState(null);

      let it = new Date();
      const handleSevenDays = (number, jump) => {
        

        const newDate = new Date(currentDate.getTime() );
        newDate.setDate(newDate.getDate() + number);
        setCurrentDate(newDate);

        // Find the Tuesday of the next week
        const nextWeekDate = new Date(currentDate);
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        const daysUntilTuesday = (number - nextWeekDate.getDay()) % 7;
        nextWeekDate.setDate(currentDate + daysUntilTuesday);

        // Update the initial date to the Tuesday of the next week
        setInitialDate(nextWeekDate);
        it = nextWeekDate;

        // Update the week label based on the difference in days
        const differenceInDays = Math.floor(
          (nextWeekDate - new Date()) / (1000 * 60 * 60 * 24),
        );
        if (jump = -1){
          setWeek("Last")
          if (differenceInWeeks != 0) {
            setWeek(cweek + " ");
            } 
        } 
        else {
          setWeek("Next");
        if (differenceInWeeks != 0) {
        setWeek("In " + cweek + " ");
        } 
        }
        
          
        

        setcWeek((previous) => previous + jump);
        
        setCount((prevCount) => prevCount + jump);

        const rotatedNames = rotateArray(names, jump); // Rotate names array by 4 positions
        setNames(rotatedNames); // Update names array with rotated names
        console.log(rotatedNames);
      };

      // Calculate the difference in milliseconds between the two dates
      const differenceInMilliseconds =
        currentDate.getTime() - initialDate.getTime();

      // Convert milliseconds to weeks (1 week = 7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
      const differenceInWeeks = Math.floor(
        differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000),
      );
      const [names, setNames] = useState(rotateArray(["B", "Mama",  "Parthe", "Muno"], differenceInWeeks));
      console.log("Difference in weeks:", differenceInWeeks);

      const [bible, setBible] = useState(null);

      let [chapCount, setChapCount] = useState(
        parseInt(import.meta.env.VITE_CHAPCOUNT),
      );

      

      console.log(names);
      // Check if the difference in weeks is a whole number
      const [count, setCount] = useState(18 + differenceInWeeks);

      useEffect(() => {
        // Your logic that depends on the count value
        console.log("Count is:", count);
      }, [count]); // Watch for changes in these variables

      console.log("Count is:", count);

      const apiKey = '818d9b2a9c99e0f59389bd3de8abc0b4'; // Replace with your actual API key
      const bibleId = "7142879509583d59-01"; // Replace with the ID of the bible you want to fetch

      // Assuming chapCount and count are state variables
      const apiUrl = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${bibleBooksAbbreviations[chapCount]}.${count}`;

      useEffect(() => {
        fetch(apiUrl, {
          headers: {
            "api-key": apiKey,
          },
        })
          .then((response) => {
            if (!response.ok) {
              setErrorMessage(`Problem Fetching Data... if messages appears for more than 4 seconds check Network and reload.`)
              throw new Error("Network response was not ok");
              
            }
            return response.json();
          })
          .then((data) => {
            console.log("Bible:", data);
            console.log("content", data.data.content);
            setBible(data.data);
            setErrorMessage(null);
          })
          .catch((error) => {
            if (error === undefined) {
                setErrorMessage("Undefined error occurred");
                
                return; // Exit the function if error is undefined
            }
        
            
            // Check if error.status or error.code exists and handle accordingly
            if (error instanceof TypeError && error.message === "Failed to fetch") {
              
              setErrorMessage('Check your network connection or Api is down, try again later')// Additional handling if necessary
              return;
          }else if (error instanceof Response && error.status >= 400 && error.status < 600) {
                setErrorMessage("Server is Down, Try again later..."); 
                return;// Show alert for "Service Unavailable"
            } else {
                // Handle other errors setErrorMessage
                
                
                setChapCount((prevChapCount) => prevChapCount + 1); // Increment chapCount
                setCount(1); // Reset count to 1
                setErrorMessage(`Fetching new book please wait... if messages appears for more than 4 seconds check Network and reload.`);
            }
        });
      }, [apiUrl, apiKey, chapCount, count]);

      useEffect(() => {
        // Check if Bible content is available
        function removeHtmlTags(html) {
          return html; // Replace HTML tags with an empty string
        }

        if (bible && bible.content) {
          // Add null check for bible
          // Remove HTML tags from Bible content
          const textContent = removeHtmlTags(bible.content);
          // Log the text content

          // Use a regular expression to match verse elements
          const verses = textContent.match(
            /<span data-number="\d+" class="v">\d+<\/span>/g,
          );
          console.log("Verses:", verses); // Log the matched verses

          if (verses) {
            // Add null check for verses
            // Desired number of partitions
            const numPartitions = 4;

            // Calculate the total number of verses
            const totalVerses = bible.verseCount;

            // Calculate the approximate number of verses per partition
            const versesPerPartition = Math.ceil(totalVerses / numPartitions);

            // Partition verses into four parts
            let partitions = Array(numPartitions).fill("");
            let currentPartitionIndex = 0;
            let currentPartitionVerses = 0;
            let verseRanges = Array(numPartitions).fill({ start: 1, end: 0 }); // Initialize verse ranges

            verses.forEach((verse) => {
              // Add the current verse to the current partition
              partitions[currentPartitionIndex] += verse;

              // Update the number of verses in the current partition
              currentPartitionVerses++;

              // Update the end verse of the current range
              verseRanges[currentPartitionIndex].end++;

              // Check if we should move to the next partition
              if (
                currentPartitionVerses >= versesPerPartition &&
                currentPartitionIndex < numPartitions - 1
              ) {
                // Move to the next partition
                currentPartitionIndex++;
                currentPartitionVerses = 0;

                // Reset the verse range for the next partition
                verseRanges[currentPartitionIndex] = {
                  start: verseRanges[currentPartitionIndex - 1].end + 1,
                  end: verseRanges[currentPartitionIndex - 1].end,
                };
              }
            });

            // Print the verse range for each partition
            for (let i = 0; i < numPartitions; i++) {
              console.log(
                `Partition ${i + 1}: Verses ${verseRanges[i].start}-${verseRanges[i].end}`,
              );
            }

            // Set state for partitions and verseRanges
            setPartitions(partitions);
            setVerseRanges(verseRanges);
          }
        }
      }, [bible]);

      const [partitions, setPartitions] = useState([]);
      const [verseRanges, setVerseRanges] = useState([]);

      return (
        <>
          {bible && (
            <section className="main">
              <div className="content">
                <div className="titles">
                  <h2>
                    <p className="week">{week} Weeks</p>
                    {currentDate.toLocaleString("en-Za", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  {errorMessage && <p className="error">{errorMessage}</p>}
                  <h1>{bible.reference}</h1>
                </div>

                <div className="partions">
                  {partitions.map((partition, index) => (
                    <div key={index} className="person">
                      <div>
                        <p>{names[index]}</p>
                      </div>{" "}
                      <div>
                        <p className="verses">
                          {verseRanges[index].start} - {verseRanges[index].end}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="btn-div"> 
               <button className="btn-next" onClick={() => handleSevenDays(-7, -1)}>
                  {`Prev Week`}
                </button>
                <button className="btn-next" onClick={() => handleSevenDays(7, 1)}>
                {`Next Week`}
                </button>
              
              </div>
            </section>
          )}
        </>
      );
    }

    export default Home;
