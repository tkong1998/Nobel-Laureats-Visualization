# Project Description

<b>Due Date</b>: April 22, 2019


<b>Authors</b>: Ziwei MIAO, Tung KONG  

<b>Supported Analytic Tasks:</b>  

|Low-level|Implementation in Nobel Laureates Dataset|
| ------------- |-------------|
|Retrieve Value|Getting detailed winner information of each laureate by hovering the anchor on the visualization charts|
|  |Getting information of gender, share, and alive distribution for each country by hovering the anchor on the map|
|  |Getting information of gender, share, and alive distribution for each category by hovering the anchor|
|  |Getting the information of category by choosing descending and ascending|
|  |Getting the information of year by choosing descending and ascending|
|Compute Derived Value|Compute the average age of laureates and also the average ages of laureates by category|
|  |Compute the total number of laureates, total percentage of male/female winners, total percentage of alive winners, and total percentage of people to share the prize by country or by category|
|Characterize Distribution|Shows the geographical and age distributions of Nobel prizes in each category|
|  |Shows the distribution of gender, prize shares, and rate of death of laureates in each country|  

|High-level|Insightful Information retrieved from the analysis of the dataset|
| ------------- |-------------|
|Knowledge Discovery|Learn the trend, statistics, and people based on the selected area on the map or selected dot on the chart|
|Gain Insight|The visualization is able to address the insightful questions that users would like to know about the general statistics of Nobel Prize winners and data characteristics|
|Sense Making|Can navigate the visualizations intuitively. The world map, histogram, and linear charts will automatically generate the expected information. The system addresses the missing information correctly (country). The system uses the correct graph to indicate the fact and tells a story about the history of the Nobel Prize and displays the information of the those contributors in correct classifications|

<b>Design Overview:</b>  
_Insightful Questions:_  
1.What is the geographical distribution of Nobel prizes in respective category?  
2.What is the age trend of winning nobel prizes?  
3.What is the gender, alive, and share information of Nobel prizes for each country throughout the history?  
4.What is the gender, alive, and share information of Nobel prizes for each category throughout the history?  
5.How can the user navigate detailed information of each nobel prize winner?  

_System Work:_   
The design of Nobel Laureates visualization aims to look back on the remarkable history of the Nobel Prize from 1901 to 2015 and address the user’s insightful questions. Therefore, we divide our design into two sections, including the world distribution and the linear charts indicated in age and category. The world distribution consists of an interactive map, histogram and pie charts.
One limitation of the our system is that we utilize the “born_country” column as the geographic information instead of using the “affiliation_country” because the data in the later column is not integral. By that, users may get less insightful geographic information from our system. However, this limitation does not affect the overall message that we want to carry out or other features of our system, and users can also gain other insights from us.
Our interactive visualization should work consistently.  

_Design Principles & Evaluation:_  
The first section supports navigation through location and category. Based on the characteristics of the dataset, we found that the dataset shows diversity in countries, so we decided to use the world map as our primary navigation carrier. To combine the world map with detailed information, we use category, gender, share, and alive/death as the attributes. The world map connects to the histogram bars and the pie chart via hover functionalities. The histogram is located next to the world map.  
![alt text](https://github.com/tkong1998/Nobel-Laureats-Visualization/blob/master/images/Picture1.png?raw=true)  
While hovering different countries on the map, the category histograms will emphasize the specific category in a specific year and tell the user that at least winner in this classification was born in the hovered country (Question 1). Additionally, the pie charts and the text box will show instantly. The pie charts include gender, alive, and share distributions of Nobel prizes for each country throughout history. The text box will describe the specific country name, the total number of winners, and the number of winners in each category (Question 3).   

![alt text](https://github.com/tkong1998/Nobel-Laureats-Visualization/blob/master/images/Picture2.png?raw=true)  
When hovering the histogram bar, the world map will highlight the geographical locations of Nobel prizes in the respective category, which informs the user about people from a particular part of the world have been awarded for their outstanding contributions and the conclusions of their situations (Question 1). Also, the pie charts and the text box will show up correspondingly with the statistics of the number of awards in total, gender distribution, alive distribution, and share information (Question 4).
Moreover, our design allows the user to choose their preference of histogram bars. For instance, if users want to view the latest Nobel Prize information, they can select “Year” and “Descending” to fulfill their requirement and the graph will change responsively in a few seconds.  

![alt text](https://github.com/tkong1998/Nobel-Laureats-Visualization/blob/master/images/Picture3.png?raw=true)  
The second section focuses on indicating the age trend of Nobel Prize winners and detailed information of each winner. In this linear graph, we combined all the personal details of each winner and classified data into prize categories while revealing the insights of age and gender. Our graph can tell the user that the age range of winners in each prize category is 57 - 66 with an average in 58 (Question 2).
  
![alt text](https://github.com/tkong1998/Nobel-Laureats-Visualization/blob/master/images/Picture4.png?raw=true)  
Each dot represents a winner. To distinguish the gender difference, female winners are circled around. We use this unique design to show a fact that men dominate all categories, though women have been recognized more in the area of Peace and Literature. We believe that the user would like to know the personal details, so we designed an instant pop-up with all the information included (Question 5). 






