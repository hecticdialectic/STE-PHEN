# tidyverse
Hannah Little  
12/9/2017  

This is a markdown document as an introduction to R and tidying data, and how to tidy data specifically from the Crossmodality Toolkit study.

Starting note: Some of this tutorial is based on materials from Michael C. Frank's tidyverse tutorial here: https://github.com/Data-on-the-Mind/2017-workshop-frank/blob/master/tidyverse_tutorial.Rmd. There is a video of this workshop here: https://www.youtube.com/watch?v=qvPDE4ppAns - This is just the very basics introducing you to the tidyverse and what you need to get the data in shape. This will be QUICK, so if you want to get to grips with this stuff properly you can go back watch Frank's video with his materials (above).


![If you're super keen, you can also look up Hadley Wickham's [R for data scientists] (http://r4ds.had.co.nz/).](http://r4ds.had.co.nz/cover.png)


```r
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
pilotdata <- read.csv("https://raw.githubusercontent.com/hecticdialectic/Crossmodality-Toolkit/master/data/pilotData.csv?token=AXaLGGK7rBWVduR09zl_3xrDg77RIlb1ks5ZymKZwA%3D%3D")
affectdata <- read.csv("https://raw.githubusercontent.com/hecticdialectic/Crossmodality-Toolkit/master/data/affectData.csv?token=AXaLGBfLgd5jhpB-WjmSC5WTgwYvXS3Oks5Zy3QTwA%3D%3D")
simdata <- read.csv("https://raw.githubusercontent.com/hecticdialectic/Crossmodality-Toolkit/master/data/SimulatedData.csv?token=AXaLGAKjwbxgrIVgLPHSrYttvUEnIuS6ks5Zy4FRwA%3D%3D")
```


```r
#Creating columns saying what dataset the data came from
pilotdata$DataSet <- "Pilot"
affectdata$DataSet <- "Affect"
simdata$DataSet <- "Simulated"
```




```r
SSData <- rbind(pilotdata, affectdata)
```



```r
pander(head(SSData))
```


------------------------------------------------------------------------
 X   trialNum    rt     subject         condition       Focal1   Focal2 
--- ---------- ------ ------------ ------------------- -------- --------
 0      1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  

 1      2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  

 2      3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  

 3      4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  

 4      5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  

 5      6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape  
------------------------------------------------------------------------

Table: Table continues below

 
-----------------------------------------------------------------------
 Focal3   ParticipantNum         InducerL               InducerR       
-------- ---------------- ---------------------- ----------------------
 Speed          10             Affect-EB-H            Affect-EB-L      

 Speed          10             Noise-Hum-L            Noise-Hum-H      

 Speed          10         Brightness-Squares-L   Brightness-Squares-H 

 Speed          10             Amp-Pulse-L            Amp-Pulse-H      

 Speed          10             Noise-Hum-H            Noise-Hum-L      

 Speed          10            Noise-Pulse-L          Noise-Pulse-H     
-----------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------
  ConcurrentL     ConcurrentR    choice   DataSet 
--------------- --------------- -------- ---------
 Noise-Piano-H   Noise-Piano-L     1       Pilot  

  Speed-SP3-L     Speed-SP3-H      1       Pilot  

  Speed-SP2-H     Speed-SP2-L      1       Pilot  

  Speed-SP3-H     Speed-SP3-L      1       Pilot  

  Speed-SP2-L     Speed-SP2-H      1       Pilot  

 Pitch-Piano-L   Pitch-Piano-H     0       Pilot  
--------------------------------------------------

These data are tidy: each row describes a single trial. Each column describes some aspect of tha trial, including their id (`subject`), condition (`condition`), what was displayed on the left in that trail (`InducerL`), what was displayed on the right in that trail (`InducerR`), what was displayed on the top in that trail (`ConcurrentL`), what was displayed on the top in that trail (`ConcurrentR`), and whether the participant matched the `InducerL` with `ConcurrentL` or not ('choice', yes = 0, no = 1)



## Functions and Pipes

A quick example of a function: 


```r
mean(pilotdata$choice)
```

```
## [1] 0.482582
```

Pipes are a way to write strings of functions more easily. They bring the first argument of the function to the bedginning. So you can write:


```r
pilotdata$choice %>% mean
```

```
## [1] 0.482582
```
How man coniditions do we have?

Unpiped version:


```r
length(unique(pilotdata$condition))
```

```
## [1] 6
```

Piped version: 


```r
pilotdata$condition %>%
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
min(table(pilotdata$condition)/96)
```

```
## [1] 10
```

```r
#and
max(table(pilotdata$condition)/96)
```

```
## [1] 11
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
##  Min.   : 0.00   Min.   : 1.00   Min.   :   917   0BwAB3cQny:  96  
##  1st Qu.:20.00   1st Qu.:21.00   1st Qu.:  3640   2fgfNXCWoW:  96  
##  Median :40.00   Median :41.00   Median :  4877   4EYlfayMb2:  96  
##  Mean   :41.49   Mean   :42.49   Mean   :  6568   5Iv1RE0roc:  96  
##  3rd Qu.:60.00   3rd Qu.:61.00   3rd Qu.:  6862   5P5Px641Uv:  96  
##  Max.   :95.00   Max.   :96.00   Max.   :680669   5eNXA6XYSE:  96  
##                                                   (Other)   :8800  
##   condition            Focal1             Focal2         
##  Length:9376        Length:9376        Length:9376       
##  Class :character   Class :character   Class :character  
##  Mode  :character   Mode  :character   Mode  :character  
##                                                          
##                                                          
##                                                          
##                                                          
##     Focal3          ParticipantNum            InducerL   
##  Length:9376        Length:9376        Affect-SC-H: 352  
##  Class :character   Class :character   Affect-EB-H: 344  
##  Mode  :character   Mode  :character   Affect-HS-L: 333  
##                                        Affect-PD-L: 321  
##                                        Affect-HS-H: 295  
##                                        Affect-EB-L: 290  
##                                        (Other)    :7441  
##         InducerR         ConcurrentL        ConcurrentR       choice      
##  Affect-SC-L: 352   Affect-PD-L: 357   Affect-PD-H: 357   Min.   :0.0000  
##  Affect-EB-L: 344   Affect-EB-H: 342   Affect-EB-L: 342   1st Qu.:0.0000  
##  Affect-HS-H: 333   Affect-SC-H: 334   Affect-SC-L: 334   Median :0.0000  
##  Affect-PD-H: 321   Affect-HS-H: 306   Affect-HS-L: 306   Mean   :0.4806  
##  Affect-HS-L: 295   Affect-HS-L: 298   Affect-HS-H: 298   3rd Qu.:1.0000  
##  Affect-EB-H: 290   Affect-EB-L: 284   Affect-EB-H: 284   Max.   :1.0000  
##  (Other)    :7441   (Other)    :7455   (Other)    :7455                   
##    DataSet         
##  Length:9376       
##  Class :character  
##  Mode  :character  
##                    
##                    
##                    
## 
```

What if we just want to see the conditions?


```r
unique(pilotdata$condition)
```

```
## [1] "Noise-Shape-Speed"      "Pitch-Size-Color"      
## [3] "Brightness-Amp-Affect"  "Noise-Brightness-Color"
## [5] "Pitch-Shape-Affect"     "Amp-Size-Speed"
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


-----------------------------------------------------------------------------
 trialNum    rt     subject         condition       Focal1   Focal2   Focal3 
---------- ------ ------------ ------------------- -------- -------- --------
    1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  
-----------------------------------------------------------------------------

Table: Table continues below

 
------------------------------------------------------------------------------
 ParticipantNum         InducerL               InducerR          ConcurrentL  
---------------- ---------------------- ---------------------- ---------------
       10             Affect-EB-H            Affect-EB-L        Noise-Piano-H 

       10             Noise-Hum-L            Noise-Hum-H         Speed-SP3-L  

       10         Brightness-Squares-L   Brightness-Squares-H    Speed-SP2-H  

       10             Amp-Pulse-L            Amp-Pulse-H         Speed-SP3-H  

       10             Noise-Hum-H            Noise-Hum-L         Speed-SP2-L  

       10            Noise-Pulse-L          Noise-Pulse-H       Pitch-Piano-L 
------------------------------------------------------------------------------

Table: Table continues below

 
----------------------------------
  ConcurrentR    choice   DataSet 
--------------- -------- ---------
 Noise-Piano-L     1       Pilot  

  Speed-SP3-H      1       Pilot  

  Speed-SP2-L      1       Pilot  

  Speed-SP3-L      1       Pilot  

  Speed-SP2-H      1       Pilot  

 Pitch-Piano-H     0       Pilot  
----------------------------------

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


-----------------------------------------------------------------------------
 trialNum    rt     subject         condition       Focal1   Focal2   Focal3 
---------- ------ ------------ ------------------- -------- -------- --------
    1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  
-----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------
 ParticipantNum   IndDomainL   IndSetL   IndTokenL         InducerR       
---------------- ------------ --------- ----------- ----------------------
       10           Affect       EB          H           Affect-EB-L      

       10           Noise        Hum         L           Noise-Hum-H      

       10         Brightness   Squares       L       Brightness-Squares-H 

       10            Amp        Pulse        L           Amp-Pulse-H      

       10           Noise        Hum         H           Noise-Hum-L      

       10           Noise       Pulse        L          Noise-Pulse-H     
--------------------------------------------------------------------------

Table: Table continues below

 
---------------------------------------------------------------------
 ConDomainL   ConSetL   ConTokenL    ConcurrentR    choice   DataSet 
------------ --------- ----------- --------------- -------- ---------
   Noise       Piano        H       Noise-Piano-L     1       Pilot  

   Speed        SP3         L        Speed-SP3-H      1       Pilot  

   Speed        SP2         H        Speed-SP2-L      1       Pilot  

   Speed        SP3         H        Speed-SP3-L      1       Pilot  

   Speed        SP2         L        Speed-SP2-H      1       Pilot  

   Pitch       Piano        L       Pitch-Piano-H     0       Pilot  
---------------------------------------------------------------------
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


-----------------------------------------------------------------------------
 trialNum    rt     subject         condition       Focal1   Focal2   Focal3 
---------- ------ ------------ ------------------- -------- -------- --------
    1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  
-----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------
 ParticipantNum   IndDomainL   IndSetL   IndTokenL         InducerR       
---------------- ------------ --------- ----------- ----------------------
       10           Affect       EB          H           Affect-EB-L      

       10           Noise        Hum         L           Noise-Hum-H      

       10         Brightness   Squares       L       Brightness-Squares-H 

       10            Amp        Pulse        L           Amp-Pulse-H      

       10           Noise        Hum         H           Noise-Hum-L      

       10           Noise       Pulse        L          Noise-Pulse-H     
--------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------------
 ConDomainL   ConSetL   ConTokenL    ConcurrentR    choice   DataSet   Response 
------------ --------- ----------- --------------- -------- --------- ----------
   Noise       Piano        H       Noise-Piano-L     1       Pilot       1     

   Speed        SP3         L        Speed-SP3-H      1       Pilot       1     

   Speed        SP2         H        Speed-SP2-L      1       Pilot       0     

   Speed        SP3         H        Speed-SP3-L      1       Pilot       0     

   Speed        SP2         L        Speed-SP2-H      1       Pilot       0     

   Pitch       Piano        L       Pitch-Piano-H     0       Pilot       1     
--------------------------------------------------------------------------------

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


-----------------------------------------------------------------------------
 trialNum    rt     subject         condition       Focal1   Focal2   Focal3 
---------- ------ ------------ ------------------- -------- -------- --------
    1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  
-----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------
 ParticipantNum   IndDomainL   IndSetL   IndTokenL         InducerR       
---------------- ------------ --------- ----------- ----------------------
       10           Affect       EB          H           Affect-EB-L      

       10           Noise        Hum         L           Noise-Hum-H      

       10         Brightness   Squares       L       Brightness-Squares-H 

       10            Amp        Pulse        L           Amp-Pulse-H      

       10           Noise        Hum         H           Noise-Hum-L      

       10           Noise       Pulse        L          Noise-Pulse-H     
--------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------------
 ConDomainL   ConSetL   ConTokenL    ConcurrentR    choice   DataSet   Response 
------------ --------- ----------- --------------- -------- --------- ----------
   Noise       Piano        H       Noise-Piano-L     1       Pilot       1     

   Speed        SP3         L        Speed-SP3-H      1       Pilot       1     

   Speed        SP2         H        Speed-SP2-L      1       Pilot       0     

   Speed        SP3         H        Speed-SP3-L      1       Pilot       0     

   Speed        SP2         L        Speed-SP2-H      1       Pilot       0     

   Pitch       Piano        L       Pitch-Piano-H     0       Pilot       1     
--------------------------------------------------------------------------------


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


-----------------------------------------------------------------------------
 trialNum    rt     subject         condition       Focal1   Focal2   Focal3 
---------- ------ ------------ ------------------- -------- -------- --------
    1       9226   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    2       7482   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    3       6335   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    4       6459   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    5       6483   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  

    6       8374   0BwAB3cQny   Noise-Shape-Speed   Noise    Shape    Speed  
-----------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------
 ParticipantNum   IndDomainL   IndSetL   IndTokenL         InducerR       
---------------- ------------ --------- ----------- ----------------------
       10           Affect       EB          H           Affect-EB-L      

       10           Noise        Hum         L           Noise-Hum-H      

       10         Brightness   Squares       L       Brightness-Squares-H 

       10            Amp        Pulse        L           Amp-Pulse-H      

       10           Noise        Hum         H           Noise-Hum-L      

       10           Noise       Pulse        L          Noise-Pulse-H     
--------------------------------------------------------------------------

Table: Table continues below

 
--------------------------------------------------------------------------------
 ConDomainL   ConSetL   ConTokenL    ConcurrentR    choice   DataSet   Response 
------------ --------- ----------- --------------- -------- --------- ----------
   Noise       Piano        H       Noise-Piano-L     1       Pilot       1     

   Speed        SP3         L        Speed-SP3-H      1       Pilot       1     

   Speed        SP2         H        Speed-SP2-L      1       Pilot       0     

   Speed        SP3         H        Speed-SP3-L      1       Pilot       0     

   Speed        SP2         L        Speed-SP2-H      1       Pilot       0     

   Pitch       Piano        L       Pitch-Piano-H     0       Pilot       1     
--------------------------------------------------------------------------------

Table: Table continues below

 
---------------------------
 IndDomainL2   ConDomainL2 
------------- -------------
  Affect EB       Noise    

    Noise         Speed    

 Brightness       Speed    

     Amp          Speed    

    Noise         Speed    

    Noise         Pitch    
---------------------------


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
Predictions <- read.csv("https://raw.githubusercontent.com/hecticdialectic/Crossmodality-Toolkit/master/data/ImputedPredictions.csv?token=AXaLGMmfR3oToUirT7fWqkLwjLY5SKARks5Zy5QjwA%3D%3D")

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




