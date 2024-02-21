import React, { useEffect, useState } from 'react';
import './home.css'

function Home() {
  function rotateArray(arr, count) {
    const rotatedArray = [...arr];
    for (let i = 0; i < count; i++) {
        const lastElement = rotatedArray.pop();
        rotatedArray.unshift(lastElement);
    }
    return rotatedArray;
}

  const initialDate = new Date('Tue Feb 20 2024 09:34:08 GMT-0800');
  const [currentDate, setCurrentDate] = useState(new Date());
  const bibleBooksAbbreviations = [
    "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO", "ECC", "SON", "ISA", "JER", "LAM", "EZE", "DAN", "HOS", "JOE", "AMO", "OBA", "JON", "MIC", "NAH", "HAB", "ZEP", "HAG", "ZEC", "MAL", "MAT", "MAR", "LUK", "JOH", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH", "PHI", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAM", "1PE", "2PE", "1JO", "2JO", "3JO", "JUD", "REV"
  ];
  const [names, setNames] = useState(['Muno', 'B', 'Parthe', 'Mama']);
  const [week, setWeek] = useState('Next')
  const [cweek, setcWeek] = useState(2)
  const handleAddSevenDays = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    
    setCurrentDate(newDate);
    console.log('button pressed');

    const nextWeekDate = new Date(currentDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);

  // Calculate the difference in days between current date and next week's date
  const differenceInDays = Math.floor((nextWeekDate - new Date()) / (1000 * 60 * 60 * 24));

  // Set week based on difference in days
  if (differenceInDays <= 2) {
    setWeek('This');
  } else {
    setWeek('In (' + cweek +")");
  }
    
    setcWeek(previous => previous + 1)
    setWeek('In (' + cweek +")")

    setCount(prevCount => prevCount + 1);
    
    const rotatedNames = rotateArray(names, 1); // Rotate names array by 4 positions
    setNames(rotatedNames); // Update names array with rotated names
    console.log(rotatedNames);
  };

 
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = currentDate.getTime() - initialDate.getTime();
  
  // Convert milliseconds to weeks (1 week = 7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
  const differenceInWeeks = Math.floor(differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000));
  
  
   const [bible, setBible] = useState(null);
   let [chapCount, setChapCount] = useState(parseInt(import.meta.env.VITE_CHAPCOUNT));
  
   console.log(names)
  // Check if the difference in weeks is a whole number
  const [count, setCount] = useState(17); 

  useEffect(() => {
    // Your logic that depends on the count value
    console.log("Count is:", count);
  }, [count]);// Watch for changes in these variables

  console.log("Count is:", count);
  
 
  const apiKey = '818d9b2a9c99e0f59389bd3de8abc0b4'; // Replace with your actual API key
  const bibleId = '7142879509583d59-01'; // Replace with the ID of the bible you want to fetch
  
  // Assuming chapCount and count are state variables
  const apiUrl = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${bibleBooksAbbreviations[chapCount]}.${count}`;
  
  let countSetSuccessful = false;
  
  useEffect(() => {
    fetch(apiUrl, {
      headers: {
        'api-key': apiKey
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Bible:', data);
        console.log('content', data.data.content);
        setBible(data.data);
      })
      .catch(error => {
        console.error('Error fetching bible:', error);
        // Check if error.status exists and handle accordingly
        if ( error.code === 400) {
          // Assuming setChapCount and setCount are functions to update chapCount and count
          
        } else if (error && error.status === 503) {
          alert('Api is Down, Try again later...'); // Show alert for "Service Unavailable"
        } else {
           // Handle other errors
           setChapCount(prevChapCount => prevChapCount + 1); // Increment chapCount
          setCount(1); // Reset count to 1
          alert('Fetching Next Book ...')
        }
      }); 
  }, [apiUrl, apiKey, chapCount, count]);

  

  useEffect(() => {
    // Check if Bible content is available
    function removeHtmlTags(html) {
        return html; // Replace HTML tags with an empty string
    }

    if (bible && bible.content) { // Add null check for bible
        // Remove HTML tags from Bible content
        const textContent = removeHtmlTags(bible.content);
         // Log the text content

        // Use a regular expression to match verse elements
        const verses = textContent.match(/<span data-number="\d+" class="v">\d+<\/span>/g);
        console.log('Verses:', verses); // Log the matched verses

        if (verses) { // Add null check for verses
            // Desired number of partitions
            const numPartitions = 4;

            // Calculate the total number of verses
            const totalVerses = bible.verseCount;

            // Calculate the approximate number of verses per partition
            const versesPerPartition = Math.ceil(totalVerses / numPartitions);

            // Partition verses into four parts
            let partitions = Array(numPartitions).fill('');
            let currentPartitionIndex = 0;
            let currentPartitionVerses = 0;
            let verseRanges = Array(numPartitions).fill({ start: 1, end: 0 }); // Initialize verse ranges

            verses.forEach(verse => {
                // Add the current verse to the current partition
                partitions[currentPartitionIndex] += verse;

                // Update the number of verses in the current partition
                currentPartitionVerses++;

                // Update the end verse of the current range
                verseRanges[currentPartitionIndex].end++;

                // Check if we should move to the next partition
                if (currentPartitionVerses >= versesPerPartition && currentPartitionIndex < numPartitions - 1) {
                    // Move to the next partition
                    currentPartitionIndex++;
                    currentPartitionVerses = 0;

                    // Reset the verse range for the next partition
                    verseRanges[currentPartitionIndex] = { start: verseRanges[currentPartitionIndex - 1].end + 1, end: verseRanges[currentPartitionIndex - 1].end };
                }
            });

            // Print the verse range for each partition
            for (let i = 0; i < numPartitions; i++) {
                console.log(`Partition ${i + 1}: Verses ${verseRanges[i].start}-${verseRanges[i].end}`);
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
       
      <section className='main'>
        <div className="content">
          <div className="titles">
            <h2><p className='week'>{week} Weeks</p>{currentDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        <h1>{bible.reference}</h1>
          </div>
        
        <div className="partions">
          {partitions.map((partition, index) => (
          <div key={index} className='person'>
            <div ><p>{names[index]}</p></div>  <div><p className="verses">{verseRanges[index].start} - {verseRanges[index].end}</p></div>
            
          </div>
        ))}
        </div>
        </div><div className="btn-div"><button className='btn-next' onClick={handleAddSevenDays}>Next Week</button>
          </div>
      </section>
    )} 
    </>
  );
}

export default Home;

