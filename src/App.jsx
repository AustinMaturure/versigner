import React, { useEffect, useState } from 'react';

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
  const currentDate = new Date('Wed Jun 12 2024 09:34:08 GMT-0800');
  
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = currentDate.getTime() - initialDate.getTime();
  
  // Convert milliseconds to weeks (1 week = 7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
  const differenceInWeeks = Math.floor(differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000));
  
  let count = 1;
   const [bible, setBible] = useState(null);
   let names = ['Muno', 'B', 'Parthe', 'Mama'];
   console.log(names)
  // Check if the difference in weeks is a whole number
  if (differenceInMilliseconds % (7 * 24 * 60 * 60 * 1000) === 0) {
    count = count + differenceInWeeks;
    
    names = rotateArray(names, count);
      
  
  }
  
  console.log("Count:", count);
  
 
  const apiKey = '818d9b2a9c99e0f59389bd3de8abc0b4'; // Replace with your actual API key
  const bibleId = '7142879509583d59-01'; // Replace with the ID of the bible you want to fetch
  const apiUrl = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/JER.${count}`;

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
        setBible(data.data);
      })
      .catch(error => console.error('Error fetching bible:', error));
  }, [apiUrl, apiKey]); 

  useEffect(() => {
    // Check if Bible content is available
    function removeHtmlTags(html) {
      return html.replace(/<[^>]+>/g, ''); // Replace HTML tags with an empty string
    }
  
    if (bible && bible.content) {
      // Remove HTML tags from Bible content
      const textContent = removeHtmlTags(bible.content);
      const sentences = textContent.match(/[^.!?]+[.!?]+/g); // Split the content into sentences
  
      // Desired number of partitions
      const numPartitions = 4;
  
      // Calculate total length of text
      const totalLength = textContent.length;
  
      // Calculate the approximate length of each partition
      const approximatePartitionLength = Math.floor(totalLength / numPartitions);
  
      // Partition text into four parts
      let partitions = Array(numPartitions).fill('');
      let currentPartitionIndex = 0;
      let currentPartitionLength = 0;
      let verseRanges = Array(numPartitions).fill({ start: 1, end: 0 }); // Initialize verse ranges
  
      sentences.forEach(sentence => {
        // Add the current sentence to the current partition
        partitions[currentPartitionIndex] += sentence;
  
        // Update the length of the current partition
        currentPartitionLength += sentence.length;
  
        // Update the end verse of the current range
        verseRanges[currentPartitionIndex].end++;
  
        // Check if we should move to the next partition
        if (currentPartitionLength >= approximatePartitionLength && currentPartitionIndex < numPartitions - 1) {
          // Print the verse range for the current partition
          console.log(`Partition ${currentPartitionIndex + 1}: Verses ${verseRanges[currentPartitionIndex].start}-${verseRanges[currentPartitionIndex].end}`);
  
          // Move to the next partition
          currentPartitionIndex++;
          currentPartitionLength = 0;
  
          // Reset the verse range for the next partition
          verseRanges[currentPartitionIndex] = { start: verseRanges[currentPartitionIndex - 1].end + 1, end: verseRanges[currentPartitionIndex - 1].end };
        }
      });
  
      // Print the verse range for the last partition
      console.log(`Partition ${numPartitions}: Verses ${verseRanges[numPartitions - 1].start}-${verseRanges[numPartitions - 1].end}`);
  
      // Set state for partitions and verseRanges
      setPartitions(partitions);
      setVerseRanges(verseRanges);
    }
  }, [bible]);
  

 

  const [partitions, setPartitions] = useState([]);
  const [verseRanges, setVerseRanges] = useState([]);
  

  return (
    <>
      {bible && (
        
      <div><h1>{bible.reference}</h1>
      
        {partitions.map((partition, index) => (
          <div key={index}>
            <p>{names[index]} : {verseRanges[index].start} - {verseRanges[index].end}</p>
            
          </div>
        ))}
      </div>
    )}
    </>
  );
}

export default Home;

