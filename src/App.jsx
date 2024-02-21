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
  const currentDate = new Date('Tue Feb 27 2024 09:34:08 GMT-0800') ;
  
  // Calculate the difference in milliseconds between the two dates
  const differenceInMilliseconds = currentDate.getTime() - initialDate.getTime();
  
  // Convert milliseconds to weeks (1 week = 7 days = 7 * 24 * 60 * 60 * 1000 milliseconds)
  const differenceInWeeks = Math.floor(differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000));
  
  let [count, setCount] = useState(parseInt(import.meta.env.VITE_COUNT))
  console.log(count)
   const [bible, setBible] = useState(null);
   let names = ['Muno', 'B', 'Parthe', 'Mama'];
   console.log(names)
  // Check if the difference in weeks is a whole number
  if (differenceInMilliseconds % (7 * 24 * 60 * 60 * 1000) === 0) {
    count += differenceInWeeks;
    import.meta.env.VITE_COUNT +=  differenceInWeeks;
    
    names = rotateArray(names, count);
      
  
  }
  
  console.log("Count:", count);
  
 
  const apiKey = '818d9b2a9c99e0f59389bd3de8abc0b4'; // Replace with your actual API key
  const bibleId = '7142879509583d59-01'; // Replace with the ID of the bible you want to fetch
  const apiUrl = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/GEN.${count}`;

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
        console.log('content', data.data.content)
        setBible(data.data);
      })
      .catch(error => {console.error('Error fetching bible:', error);setCount(1)} );
  }, [apiUrl, apiKey]); 

  useEffect(() => {
    // Check if Bible content is available
    function removeHtmlTags(html) {
        return html; // Replace HTML tags with an empty string
    }

    if (bible && bible.content) { // Add null check for bible
        // Remove HTML tags from Bible content
        const textContent = removeHtmlTags(bible.content);
        console.log('Text content:', textContent); // Log the text content

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

