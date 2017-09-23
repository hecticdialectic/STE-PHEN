# tidyverse
Hannah Little  
12/9/2017  

This is a markdown document as an introduction to R and tidying data, and how to tidy data specifically from the Crossmodality Toolkit study.

Starting note: Some of this tutorial is based on materials from Michael C. Frank's tidyverse tutorial here: https://github.com/Data-on-the-Mind/2017-workshop-frank/blob/master/tidyverse_tutorial.Rmd. There is a video of this workshop here: https://www.youtube.com/watch?v=qvPDE4ppAns - This is just the very basics introducing you to the tidyverse and what you need to get the data in shape. This will be QUICK, so if you want to get to grips with this stuff properly you can go back watch Frank's video with his materials (above).


![If you're super keen, you can also look up Hadley Wickham's [R for data scientists] (http://r4ds.had.co.nz/).](http://r4ds.had.co.nz/cover.png)


```r
# install.packages(tidyr)
# install.packages(dplyr)
# install.packages(ggplot2)
# install.packages(pander)

library(tidyr)
library(dplyr)
```

```
## 
## Attaching package: 'dplyr'
```

```
## The following objects are masked from 'package:stats':
## 
##     filter, lag
```

```
## The following objects are masked from 'package:base':
## 
##     intersect, setdiff, setequal, union
```

```r
library(ggplot2)
library(pander)
```

## Tribbles

`tibble` = dataframe
Each column has a data type. 

# Tidy data

``Tidy datasets are all alike, but every messy dataset is messy in its own way."
- Hadley Wickham

Tidy data rule:
every row is a single observation
every column is a single variable

Why?
To take a uniform approach to the dataset. Easier to learn the tools with one approach and uniform data organisation. R thrives with data formatted like this.


```r
datamain <- read.csv("https://raw.githubusercontent.com/hecticdialectic/STE-PHEN/master/summer_school_sessions/10_data_prep/datamain.csv")
affectdata <- read.csv("https://raw.githubusercontent.com/hecticdialectic/STE-PHEN/master/summer_school_sessions/10_data_prep/affectdata.csv")
simdata <- read.csv("https://raw.githubusercontent.com/hecticdialectic/STE-PHEN/master/summer_school_sessions/10_data_prep/simdata.csv")
```


```r
#Creating columns saying what dataset the data came from
datamain$DataSet <- "Pilot"
affectdata$DataSet <- "Affect"
simdata$DataSet <- "Simulated"
```




```r
SSData <- rbind(datamain, affectdata)
```



```r
pander(head(SSData))
```


--------------------------------------------------------------------------------
 X   trialNum    rt     subject           condition           Focal1     Focal2 
--- ---------- ------ ------------ ----------------------- ------------ --------
 0      1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

 1      2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

 2      3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

 3      4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

 4      5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

 5      6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
--------------------------------------------------------------------------------

Table: Table continues below

 
---------------------------------------------------------------------------
 Focal3   ParticipantNum          InducerL                 InducerR        
-------- ---------------- ------------------------ ------------------------
 Affect         12             Noise-Pulse-L            Noise-Pulse-H      

 Affect         12         Brightness-Triangles-L   Brightness-Triangles-H 

 Affect         12              Affect-SC-H              Affect-SC-L       

 Affect         12         Brightness-Triangles-H   Brightness-Triangles-L 

 Affect         12             Size-Squares-H           Size-Squares-L     

 Affect         12          Brightness-Circles-L     Brightness-Circles-H  
---------------------------------------------------------------------------

Table: Table continues below

 
----------------------------------------------------------------
     ConcurrentL            ConcurrentR        choice   DataSet 
---------------------- ---------------------- -------- ---------
 Brightness-Squares-L   Brightness-Squares-H     1       Pilot  

     Speed-SP1-H            Speed-SP1-L          1       Pilot  

 Brightness-Circles-L   Brightness-Circles-H     1       Pilot  

     Amp-Pulse-L            Amp-Pulse-H          1       Pilot  

     Affect-HS-L            Affect-HS-H          1       Pilot  

     Affect-EB-L            Affect-EB-H          0       Pilot  
----------------------------------------------------------------

These data are tidy: each row describes a single trial. Each column describes some aspect of tha trial, including their id (`subject`), condition (`condition`), what was displayed on the left in that trail (`InducerL`), what was displayed on the right in that trail (`InducerR`), what was displayed on the top in that trail (`ConcurrentL`), what was displayed on the top in that trail (`ConcurrentR`), and whether the participant matched the `InducerL` with `ConcurrentL` or not ('choice', yes = 0, no = 1)



## Functions and Pipes

A quick example of a function: 


```r
mean(datamain$choice)
```

```
## [1] 0.4887153
```

Pipes are a way to write strings of functions more easily. They bring the first argument of the function to the bedginning. So you can write:


```r
datamain$choice %>% mean
```

```
## [1] 0.4887153
```
How man coniditions do we have?

Unpiped version:


```r
length(unique(datamain$condition))
```

```
## [1] 6
```

Piped version: 


```r
datamain$condition %>%
  unique %>%
  length
```

```
## [1] 6
```

Exercise, write a piped function to find the number of participants


```r
#write code here
```

We can also work out how many participants are in a condition:


```r
#between
min(table(datamain$condition)/96)
```

```
## [1] 23
```

```r
#and
max(table(datamain$condition)/96)
```

```
## [1] 25
```

# Cleaning up the data, or only getting the bits we want

We can manipulate the data using functions from `dplyr`. For example:

+ `select` - subset columns
+ `filter` - remove rows by some logical condition
+ `mutate` - create new columns
+ `summarize` - apply some function over columns in each group
+ `separate` - splitting a single variable into two (or three or FOUR OR FIVE OR ANY NUMBER)
+ `unite` - paste columns together
+ `gather` (aka `melt`)- takes multiple columns, and gathers them into key-value pairs: it makes ???wide??? data longer
+ `spread` (aka `cast`) - takes two columns (key & value) and spreads in to multiple columns, it makes ???long??? data wider.




```r
summary(SSData)
```

```
##        X            trialNum           rt               subject     
##  Min.   : 0.00   Min.   : 1.00   Min.   :   716   07v6VRVWrL:   96  
##  1st Qu.:21.00   1st Qu.:22.00   1st Qu.:  3740   0QKSdtytYo:   96  
##  Median :43.00   Median :44.00   Median :  4935   0hyFge02V3:   96  
##  Mean   :44.25   Mean   :45.25   Mean   :  6726   0n9FgftmIS:   96  
##  3rd Qu.:65.00   3rd Qu.:66.00   3rd Qu.:  6731   14Kcp8eWnj:   96  
##  Max.   :95.00   Max.   :96.00   Max.   :912412   14wn5Hs9h1:   96  
##                                                   (Other)   :16768  
##   condition            Focal1             Focal2         
##  Length:17344       Length:17344       Length:17344      
##  Class :character   Class :character   Class :character  
##  Mode  :character   Mode  :character   Mode  :character  
##                                                          
##                                                          
##                                                          
##                                                          
##     Focal3          ParticipantNum            InducerL    
##  Length:17344       Length:17344       Affect-EB-H:  476  
##  Class :character   Class :character   Affect-SC-H:  444  
##  Mode  :character   Mode  :character   Affect-PD-L:  442  
##                                        Affect-HS-L:  424  
##                                        Affect-EB-L:  416  
##                                        Affect-HS-H:  398  
##                                        (Other)    :14744  
##         InducerR          ConcurrentL         ConcurrentR   
##  Affect-EB-L:  476   Affect-EB-H:  486   Affect-EB-L:  486  
##  Affect-SC-L:  444   Affect-PD-L:  448   Affect-PD-H:  448  
##  Affect-PD-H:  442   Affect-SC-H:  428   Affect-SC-L:  428  
##  Affect-HS-H:  424   Affect-HS-L:  426   Affect-HS-H:  426  
##  Affect-EB-H:  416   Affect-HS-H:  420   Affect-HS-L:  420  
##  Affect-HS-L:  398   Affect-EB-L:  414   Affect-EB-H:  414  
##  (Other)    :14744   (Other)    :14722   (Other)    :14722  
##      choice         DataSet         
##  Min.   :0.0000   Length:17344      
##  1st Qu.:0.0000   Class :character  
##  Median :0.0000   Mode  :character  
##  Mean   :0.4864                     
##  3rd Qu.:1.0000                     
##  Max.   :1.0000                     
## 
```

What if we just want to see the conditions?


```r
unique(datamain$condition)
```

```
## [1] "Brightness-Amp-Affect"  "Amp-Size-Speed"        
## [3] "Noise-Brightness-Color" "Pitch-Shape-Affect"    
## [5] "Pitch-Size-Color"       "Noise-Shape-Speed"
```


## Selecting

If you want to add or remove *columns*, you can use `select`. In the above dataset, we don't need the "X" column, which is an artefect of the index from the original csv file. We can delete it using the following code: 


```r
SSData <- SSData %>%
  select(-X)
```

Let's look at the head of the data again!


```r
pander(head(SSData))
```


----------------------------------------------------------------------------
 trialNum    rt     subject           condition           Focal1     Focal2 
---------- ------ ------------ ----------------------- ------------ --------
    1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
----------------------------------------------------------------------------

Table: Table continues below

 
---------------------------------------------------------------------------
 Focal3   ParticipantNum          InducerL                 InducerR        
-------- ---------------- ------------------------ ------------------------
 Affect         12             Noise-Pulse-L            Noise-Pulse-H      

 Affect         12         Brightness-Triangles-L   Brightness-Triangles-H 

 Affect         12              Affect-SC-H              Affect-SC-L       

 Affect         12         Brightness-Triangles-H   Brightness-Triangles-L 

 Affect         12             Size-Squares-H           Size-Squares-L     

 Affect         12          Brightness-Circles-L     Brightness-Circles-H  
---------------------------------------------------------------------------

Table: Table continues below

 
----------------------------------------------------------------
     ConcurrentL            ConcurrentR        choice   DataSet 
---------------------- ---------------------- -------- ---------
 Brightness-Squares-L   Brightness-Squares-H     1       Pilot  

     Speed-SP1-H            Speed-SP1-L          1       Pilot  

 Brightness-Circles-L   Brightness-Circles-H     1       Pilot  

     Amp-Pulse-L            Amp-Pulse-H          1       Pilot  

     Affect-HS-L            Affect-HS-H          1       Pilot  

     Affect-EB-L            Affect-EB-H          0       Pilot  
----------------------------------------------------------------

## Separating

As we can see, there is a lot of information in the stim names: the variable they test, the type of stim they are, and whether they are high or low.  We might need to `separate` (a function from `dplyr`) this separates info out into seperate columns. 


```r
SSData <- SSData %>% 
  separate(InducerL, c('IndDomainL', 'IndSetL', 'IndTokenL'), sep='-') %>% 
  separate(ConcurrentL, c('ConDomainL', 'ConSetL', 'ConTokenL')) 
```

Again, let's see what it looks like now:


```r
pander(head(SSData))
```


----------------------------------------------------------------------------
 trialNum    rt     subject           condition           Focal1     Focal2 
---------- ------ ------------ ----------------------- ------------ --------
    1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------
 Focal3   ParticipantNum   IndDomainL    IndSetL    IndTokenL 
-------- ---------------- ------------ ----------- -----------
 Affect         12           Noise        Pulse         L     

 Affect         12         Brightness   Triangles       L     

 Affect         12           Affect        SC           H     

 Affect         12         Brightness   Triangles       H     

 Affect         12            Size       Squares        H     

 Affect         12         Brightness    Circles        L     
--------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------
        InducerR          ConDomainL   ConSetL   ConTokenL 
------------------------ ------------ --------- -----------
     Noise-Pulse-H        Brightness   Squares       L     

 Brightness-Triangles-H     Speed        SP1         H     

      Affect-SC-L         Brightness   Circles       L     

 Brightness-Triangles-L      Amp        Pulse        L     

     Size-Squares-L         Affect       HS          L     

  Brightness-Circles-H      Affect       EB          L     
-----------------------------------------------------------

Table: Table continues below

 
-----------------------------------------
     ConcurrentR        choice   DataSet 
---------------------- -------- ---------
 Brightness-Squares-H     1       Pilot  

     Speed-SP1-L          1       Pilot  

 Brightness-Circles-H     1       Pilot  

     Amp-Pulse-H          1       Pilot  

     Affect-HS-H          1       Pilot  

     Affect-EB-H          0       Pilot  
-----------------------------------------
## Mutating

We can also *add columns* using `mutate` - for instance, in our data, we might want a column stating whether the Left Inducer and Left Concurrent are both "high" or both "low".


```r
SSData <- SSData %>%
  mutate(Response = ifelse(IndTokenL==ConTokenL,1,0)) 
```

Let's see what that's done:


```r
pander(head(SSData))
```


----------------------------------------------------------------------------
 trialNum    rt     subject           condition           Focal1     Focal2 
---------- ------ ------------ ----------------------- ------------ --------
    1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------
 Focal3   ParticipantNum   IndDomainL    IndSetL    IndTokenL 
-------- ---------------- ------------ ----------- -----------
 Affect         12           Noise        Pulse         L     

 Affect         12         Brightness   Triangles       L     

 Affect         12           Affect        SC           H     

 Affect         12         Brightness   Triangles       H     

 Affect         12            Size       Squares        H     

 Affect         12         Brightness    Circles        L     
--------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------
        InducerR          ConDomainL   ConSetL   ConTokenL 
------------------------ ------------ --------- -----------
     Noise-Pulse-H        Brightness   Squares       L     

 Brightness-Triangles-H     Speed        SP1         H     

      Affect-SC-L         Brightness   Circles       L     

 Brightness-Triangles-L      Amp        Pulse        L     

     Size-Squares-L         Affect       HS          L     

  Brightness-Circles-H      Affect       EB          L     
-----------------------------------------------------------

Table: Table continues below

 
----------------------------------------------------
     ConcurrentR        choice   DataSet   Response 
---------------------- -------- --------- ----------
 Brightness-Squares-H     1       Pilot       1     

     Speed-SP1-L          1       Pilot       0     

 Brightness-Circles-H     1       Pilot       0     

     Amp-Pulse-H          1       Pilot       0     

     Affect-HS-H          1       Pilot       0     

     Affect-EB-H          0       Pilot       1     
----------------------------------------------------

## Filtering

To remove *rows* from your dataset (maybe to remove outliers, remove participants who clicked on the same thing all the time, selecting subpopulations, etc.) `filter` is function that does this! It takes a data frame as its first argument, and then as its second takes the **condition** you want to filter on.

So if we're only interested in data that involves Affect, we can do the following:



```r
affect <- SSData %>%
  filter(IndDomainL == 'Affect'| ConDomainL == 'Affect')
```



```r
pander(head(SSData))
```


----------------------------------------------------------------------------
 trialNum    rt     subject           condition           Focal1     Focal2 
---------- ------ ------------ ----------------------- ------------ --------
    1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------
 Focal3   ParticipantNum   IndDomainL    IndSetL    IndTokenL 
-------- ---------------- ------------ ----------- -----------
 Affect         12           Noise        Pulse         L     

 Affect         12         Brightness   Triangles       L     

 Affect         12           Affect        SC           H     

 Affect         12         Brightness   Triangles       H     

 Affect         12            Size       Squares        H     

 Affect         12         Brightness    Circles        L     
--------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------
        InducerR          ConDomainL   ConSetL   ConTokenL 
------------------------ ------------ --------- -----------
     Noise-Pulse-H        Brightness   Squares       L     

 Brightness-Triangles-H     Speed        SP1         H     

      Affect-SC-L         Brightness   Circles       L     

 Brightness-Triangles-L      Amp        Pulse        L     

     Size-Squares-L         Affect       HS          L     

  Brightness-Circles-H      Affect       EB          L     
-----------------------------------------------------------

Table: Table continues below

 
----------------------------------------------------
     ConcurrentR        choice   DataSet   Response 
---------------------- -------- --------- ----------
 Brightness-Squares-H     1       Pilot       1     

     Speed-SP1-L          1       Pilot       0     

 Brightness-Circles-H     1       Pilot       0     

     Amp-Pulse-H          1       Pilot       0     

     Affect-HS-H          1       Pilot       0     

     Affect-EB-H          0       Pilot       1     
----------------------------------------------------


**Exercise**

Filter out only the responses of one participant


```r
#write your code here
```



## The problem to Affect and Color

For our Affect Tokens, although we have generally tried to pick pairs where one token is high valence/arousal and the other is not, we do not expect participants to treat all High Valence/High Arousal tokens as equivalent- "Happy" has much different connotations than "Stressed" or "Excited", so we need to consider Affect Tokens individually, rather than lumping all of the Affect trials together.


```r
#1- Code "Affect" and "Color" as Tokens- once for each relevant column
#(Note we don't need to do this for *all* columns)

SSData <- SSData %>%
  mutate(IndDomainL2 = ifelse(SSData$IndDomainL == "Affect"|SSData$IndDomainL == "Color", paste(SSData$IndDomainL, SSData$IndSetL, sep = " "), SSData$IndDomainL)) %>%
  mutate(ConDomainL2 = ifelse(SSData$ConDomainL == "Affect"|SSData$ConDomainL == "Color", 
                             paste(SSData$ConDomainL, SSData$ConSetL, sep = " "), 
                       SSData$ConDomainL))
```


```r
pander(head(SSData))
```


----------------------------------------------------------------------------
 trialNum    rt     subject           condition           Focal1     Focal2 
---------- ------ ------------ ----------------------- ------------ --------
    1       5820   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    2       3725   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    3       2765   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    4       4058   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    5       5037   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   

    6       2997   07v6VRVWrL   Brightness-Amp-Affect   Brightness    Amp   
----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------
 Focal3   ParticipantNum   IndDomainL    IndSetL    IndTokenL 
-------- ---------------- ------------ ----------- -----------
 Affect         12           Noise        Pulse         L     

 Affect         12         Brightness   Triangles       L     

 Affect         12           Affect        SC           H     

 Affect         12         Brightness   Triangles       H     

 Affect         12            Size       Squares        H     

 Affect         12         Brightness    Circles        L     
--------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------
        InducerR          ConDomainL   ConSetL   ConTokenL 
------------------------ ------------ --------- -----------
     Noise-Pulse-H        Brightness   Squares       L     

 Brightness-Triangles-H     Speed        SP1         H     

      Affect-SC-L         Brightness   Circles       L     

 Brightness-Triangles-L      Amp        Pulse        L     

     Size-Squares-L         Affect       HS          L     

  Brightness-Circles-H      Affect       EB          L     
-----------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------------
     ConcurrentR        choice   DataSet   Response   IndDomainL2   ConDomainL2 
---------------------- -------- --------- ---------- ------------- -------------
 Brightness-Squares-H     1       Pilot       1          Noise      Brightness  

     Speed-SP1-L          1       Pilot       0       Brightness       Speed    

 Brightness-Circles-H     1       Pilot       0        Affect SC    Brightness  

     Amp-Pulse-H          1       Pilot       0       Brightness        Amp     

     Affect-HS-H          1       Pilot       0          Size        Affect HS  

     Affect-EB-H          0       Pilot       1       Brightness     Affect EB  
--------------------------------------------------------------------------------


##Final tidying

Select only the columns we are interested in

```r
SSData <- SSData %>% 
  select(DataSet, subject, condition, Focal1, Focal2, Focal3, trialNum, IndDomainL2, ConDomainL2, choice, Response)
```

Remane the columns

```r
colnames(SSData) <- c("DataSet", "Subject", "Condition", "Focal1", "Focal2", "Focal3", "TrialNum", "Inducer", "Concurrent", "Comparison", "Response")
```


```r
pander(head(affectdata))
```


------------------------------------------------------------------------
 X   trialNum    rt     subject     condition   Focal1   ParticipantNum 
--- ---------- ------ ------------ ----------- -------- ----------------
 0      1       7028   1d8E46bnpK    Affect     Affect         2        

 1      2       8139   1d8E46bnpK    Affect     Affect         2        

 2      3       3655   1d8E46bnpK    Affect     Affect         2        

 3      4       4712   1d8E46bnpK    Affect     Affect         2        

 4      5       4412   1d8E46bnpK    Affect     Affect         2        

 5      6       5208   1d8E46bnpK    Affect     Affect         2        
------------------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------------------------
       InducerL                InducerR          ConcurrentL    ConcurrentR  
----------------------- ----------------------- -------------- --------------
      Affect-PD-L             Affect-PD-H        Pitch-Tone-H   Pitch-Tone-L 

     Pitch-Tone-L            Pitch-Tone-H        Affect-HS-L    Affect-HS-H  

      Speed-SP4-H             Speed-SP4-L        Affect-EB-L    Affect-EB-H  

      Affect-SC-H             Affect-SC-L         Amp-Tone-H     Amp-Tone-L  

 Brightness-Diamonds-H   Brightness-Diamonds-L   Affect-SC-H    Affect-SC-L  

      Amp-Tone-L              Amp-Tone-H         Affect-HS-L    Affect-HS-H  
-----------------------------------------------------------------------------

Table: Table continues below

 
------------------------------------
 choice   DataSet   Focal2   Focal3 
-------- --------- -------- --------
   0      Affect                    

   0      Affect                    

   1      Affect                    

   0      Affect                    

   0      Affect                    

   0      Affect                    
------------------------------------


##Write the dataset to a file!


```r
#write.csv(SSData, "ste-phen/data/cleandata.csv", row.names = FALSE)
```


#Extra stuff that's study dependent

You need to run this code to get the dataset we will be using - or you can just use the cleandata.csv file in the github

Currently we have our Inducer and Concurrent domains coded in the data frame, which would let us look at all of the comparisons we are interested in - but this is likely to be too much - with Color and Affect Broken up there are 186 possible comparisons in the data.

But we don't really think that there will be much of a difference between asking someone whether a blue triangle is high pitched or asking whether a high pitched sound goes best with a blue triangle- that is, we don't suspect there is a difference between whether a domain is an inducer or a concurrent- we expect the data to be symmetrical.

This is something we can test, so we will leave our inducer and concurrent columns in the data set, but we will also code in a "Comparison" column that tells us (insensitive to order) what two domains are being compared (this will also make generating predictions simpler)
 



```r
Inducers <- unique(SSData$Inducer)       #All possible inducer token sets   
Concurrents <- unique(SSData$Concurrent)    #All possible concurrent token sets

Combinations <- expand.grid(Inducer = Inducers, Concurrent = Concurrents) # Gives all combinations


Combinations <- separate(data=Combinations, col= Inducer,     #split columns back up for subsetting
                         into= c("IndType", "IndToken"), sep = " ", remove = FALSE)
Combinations <- separate(data=Combinations, col= Concurrent, 
                         into= c("ConType", "ConToken"), sep = " ", remove = FALSE)

Combinations <- subset(Combinations, IndType != ConType)  #4- Removing impossible combinations

Combinations$Comparison <- paste(Combinations$Inducer, Combinations$Concurrent, sep = '-') #Make a comparison column
Combinations <- arrange(Combinations, Comparison)  # Order the data frame alphabetically by the comparison column

delRows = NULL # the rows to be removed
for(i in 1:nrow(Combinations)){
  j = which(Combinations$Inducer == Combinations$Concurrent[i] & Combinations$Concurrent == Combinations$Inducer[i])
  j = j [j > i]
  if (length(j) > 0){
    delRows = c(delRows, j)
  }
}
Combinations <- Combinations[-delRows,]

# Code the comparison column into the SSData frame
SSData$IndCon <- paste(SSData$Inducer, SSData$Concurrent, sep = '-')
SSData$ConInd <- paste(SSData$Concurrent, SSData$Inducer, sep = '-')

SSData$Comparison <- ifelse(SSData$IndCon %in% Combinations$Comparison,
                               SSData$IndCon,
                               SSData$ConInd)


#### Now we need to put our SimData into the same format as the rest of the data and attach it to the data frame
simdata$condition <- paste(simdata$Focal1, simdata$Focal2, simdata$Focal3)
simdata <- subset(simdata, select = c(DataSet, Id, condition, Focal1, Focal2, Focal3, TrialNum, IndDomainL2, ConDomainL2, Resp2_SIMULATED, IndCon, ConInd, Comparison))
colnames(simdata) <- c("DataSet", "Subject", "Condition", "Focal1", "Focal2", "Focal3", "TrialNum", "Inducer", "Concurrent", "Response", "IndCon", "ConInd", "Comparison")

SSData <- rbind(SSData, simdata)
```

So now we have a lovely "Comparison" column in the dataframe, which we can use for some statistical tests

The last thing we want to do is code "Correctness" for each trial. Of course in this task there is no such thing as a "correct" answer- participants choose what they want and cannot be wrong.

We do, however, have a series of predictions that can be made about this data- so we can code in "Correctness" according to those sets of predictions

We have made those predictions elsewhere and stored them as ImputedPredictions.csv.

So we simply need to load in those predictions, then use that file to populate some additional columns in our dataframe

We have three sets of predictions in our "Predictions" file

1- Magnitude Symbolism
2- Predictions generated from a lit review
3- Predictions imputed from our Affect version of the Experiment- Absolute



```r
library(plyr)
```

```
## -------------------------------------------------------------------------
```

```
## You have loaded plyr after dplyr - this is likely to cause problems.
## If you need functions from both plyr and dplyr, please load plyr first, then dplyr:
## library(plyr); library(dplyr)
```

```
## -------------------------------------------------------------------------
```

```
## 
## Attaching package: 'plyr'
```

```
## The following objects are masked from 'package:dplyr':
## 
##     arrange, count, desc, failwith, id, mutate, rename, summarise,
##     summarize
```

```r
Predictions <- read.csv("https://raw.githubusercontent.com/hecticdialectic/Crossmodality-Toolkit/master/data/ImputedPredictions.csv?token=AXaLGIC9rHBR9lDDkH6_HF7JuQj_HMUAks5ZzONIwA%3D%3D")

SSData$Magnitude <- mapvalues(SSData$Comparison,
                                from = Predictions$Comparison,
                                to = Predictions$MagSym)
SSData$LitReview <- mapvalues(SSData$Comparison,
                                from = Predictions$Comparison,
                                to = Predictions$Prediction)
SSData$Affect <- mapvalues(SSData$Comparison,
                                from = Predictions$Comparison,
                                to = Predictions$ImputedPrediction)
```

As it stands this tells us what Response each set predicts, not what is correct - we can recode that fairly simply


```r
SSData$Magnitude <- ifelse(SSData$Magnitude == SSData$Response, 1, 0)
SSData$LitReview <- ifelse(SSData$LitReview == SSData$Response, 1, 0)
SSData$Affect <- ifelse(SSData$Affect == SSData$Response, 1, 0)
```



```r
write.csv(SSData, "cleandata.csv", row.names = FALSE)
```



