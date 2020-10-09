# D3 Homework - Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

Thank you for the opportunity to collect the data for the series of feature stories about the health risks facing particular demographics. I sifted through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System. Here is a description of the steps I took to put together the scatter plots.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), but you are free to investigate a different data set. The current data set includes data on rates of income, obesity, poverty, etc., by state. Note that MOE stands for "margin of error."

### Code
1. You can find all my code on git hub site in the repository called `D3-challenge`

## First Scatter Plot (index.html)

![4-scatter](Images/4-scatter.jpg)

I chose two of the data variables `Healthcare vs. Income`.

I created a scatter plot that represents each state with circle elements. I coded this graphic in the `app.js` file and pulled in the data from `data.csv` by using the `d3.csv` function. 

* I included state abbreviations in the circles and situated your axes and labels to the left and bottom of the chart.

- - -

### Bonus Scatter Plot (index_bonus.html)

Why make a static graphic when D3 lets you interact with your data?

![7-animated-scatter](Images/7-animated-scatter.gif)

#### 1. More Data, More Dynamics

I now included more demographics and more risk factors. This plot has click events so that users can decide which data to display. I animated the transitions for the circles' locations as well as the range of the axes. I did this for three on each axis.

#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. So I created tooltips to reveal a specific element's data when the user hovers their cursor over the element. 

![8-tooltip](Images/8-tooltip.gif)

* Check out [David Gotz's example](https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) to see how you should implement tooltips with d3-tip.

- - -
### Copyright

Trilogy Education Services © 2019. All Rights Reserved.
