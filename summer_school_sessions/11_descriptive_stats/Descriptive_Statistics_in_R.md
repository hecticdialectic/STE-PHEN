# Descriptive Statistics
Alan Nielsen  
12/9/2017  

Days have past and it's finally here- our very first look at the data.

Although this section is labelled "Descriptive Statistics", it quickly became clear that there just aren't that many descriptive statistics to be done on this data that are of any real interest, so we're going to focus slightly more broadly on visualising and quanitfying our data.

Let's start by loading in our clean data and some libraries:


```r
cleandata <- read.csv(
"F:/Google Drive/GitHub Repos/STE-PHEN/summer_school_sessions/11_descriptive_stats/cleandata.csv")

data <- subset(cleandata, DataSet == "Pilot")  ##Change as appropriate

library(plyr)
library(tidyverse)
library(doBy)
```

There are lots of very basic statistics that we might want to take a look at first - in many experiments we'll want to know super simple things, like the grand mean response (or response-correctness). It's not particularly informative for our purposes, but the mean response in this dataset is 0.6219262 - which means that "High" stimuli were paired with other "High" stimuli 62.192623% of the time.

#Normality

Most often we will want to start by looking at the normality of the distributions of our data- in this case because the data is binomial and the number of trials is very low we know things won't be normally distributed, but lets take a look at the raw data anyways.

There are tons of tests of the normality of data in R, but I generally prefer visual inspection of a qqplot to any of them.


```r
ggplot(data, aes(sample = Response, colour= Condition)) + 
  stat_qq(aes(shape = Condition))+
  ggtitle("qq Plots of Data by Condition") +
  labs(x="", y="") +
  theme(axis.title.y = element_text(size=12,  color="#666666")) +
  theme(axis.text = element_text(size=8)) +
  theme(plot.title = element_text(size=16, face="bold", hjust=0, color="#666666")) +
  theme(strip.text.x = element_text(size = 8, colour = "black"))
```

![](Descriptive_Statistics_in_R_files/figure-html/qqplot of Data-1.png)<!-- -->

Not exactly normal (or possible to be normal) when looking at the raw data- obviously it is all 0s or 1s, so we need to aggregate the data in a number of ways and look at how its normality changes.

Below we'll aggregate the data per comparison and per subject, then output a new qqplot.

We'll also aggregate just per-subject and look at the same plot (and per-comparison)


```r
dataagg1 <- aggregate(Response ~ Comparison + Condition + Subject, data = data, mean)

ggplot(dataagg1, aes(sample = Response, colour= Condition)) + 
  stat_qq(aes(shape = Condition))+
  ggtitle("qq Plots of Data by Condition") +
  labs(x="", y="") +
  theme(axis.title.y = element_text(size=12,  color="#666666")) +
  theme(axis.text = element_text(size=8)) +
  theme(plot.title = element_text(size=16, face="bold", hjust=0, color="#666666")) +
  theme(strip.text.x = element_text(size = 8, colour = "black"))
```

![](Descriptive_Statistics_in_R_files/figure-html/QQPlot 2-1.png)<!-- -->

```r
dataagg2 <- aggregate(Response ~ Condition + Subject, data = data, mean)

ggplot(dataagg2, aes(sample = Response, colour= Condition)) + 
  stat_qq(aes(shape = Condition))+
  ggtitle("qq Plots of Data by Condition") +
  labs(x="", y="") +
  theme(axis.title.y = element_text(size=12,  color="#666666")) +
  theme(axis.text = element_text(size=8)) +
  theme(plot.title = element_text(size=16, face="bold", hjust=0, color="#666666")) +
  theme(strip.text.x = element_text(size = 8, colour = "black"))
```

![](Descriptive_Statistics_in_R_files/figure-html/QQPlot 2-2.png)<!-- -->

```r
dataagg3 <- aggregate(Response ~ Comparison + Condition, data = data, mean)
ggplot(dataagg3, aes(sample = Response, colour= Condition)) + 
  stat_qq(aes(shape = Condition))+
  ggtitle("qq Plots of Data by Condition") +
  labs(x="", y="") +
  theme(axis.title.y = element_text(size=12,  color="#666666")) +
  theme(axis.text = element_text(size=8)) +
  theme(plot.title = element_text(size=16, face="bold", hjust=0, color="#666666")) +
  theme(strip.text.x = element_text(size = 8, colour = "black"))
```

![](Descriptive_Statistics_in_R_files/figure-html/QQPlot 2-3.png)<!-- -->

So we have data in more bins now- there are possible values in our dataframe other than 0 and 1- but our distribution still isn't anywhere close to normal.

When we collapse to data aggregated per participant we get something slightly closer to a normal distribution, and finally when we collapse across participants and only look at Data from Condition and Comparison we are closer still, but obviously still have a hump at "1" and a smaller hump at "0".


#Means

Okay, with that slightly pointless test of normality out of the way, we can start to look at the actual data- we already know the grand mean is 0.6219262, but what did participants associate with what?

The first way we can look at this is just as a table of means


```r
dataagg4 <- aggregate(Response~Comparison, data=data, mean)
means<- as.data.frame(xtabs(Response ~ Comparison, data=dataagg4))

means
```

```
##              Comparison      Freq
## 1         Affect EB-Amp 0.9111111
## 2  Affect EB-Brightness 0.9387755
## 3    Affect EB-Color RB 0.8000000
## 4    Affect EB-Color RG 0.1875000
## 5    Affect EB-Color RY 0.3750000
## 6    Affect EB-Color YB 0.8000000
## 7       Affect EB-Noise 0.2653061
## 8       Affect EB-Pitch 0.4693878
## 9       Affect EB-Shape 0.5510204
## 10       Affect EB-Size 0.7555556
## 11      Affect EB-Speed 0.9333333
## 12        Affect HS-Amp 0.9696970
## 13 Affect HS-Brightness 1.0000000
## 14   Affect HS-Color RB 0.8750000
## 15   Affect HS-Color RG 0.2142857
## 16   Affect HS-Color RY 0.5000000
## 17   Affect HS-Color YB 0.9230769
## 18      Affect HS-Noise 0.2641509
## 19      Affect HS-Pitch 0.5555556
## 20      Affect HS-Shape 0.4912281
## 21       Affect HS-Size 0.8378378
## 22      Affect HS-Speed 0.9591837
## 23        Affect PD-Amp 0.4545455
## 24 Affect PD-Brightness 0.8108108
## 25   Affect PD-Color RB 0.6666667
## 26   Affect PD-Color RG 0.1666667
## 27   Affect PD-Color RY 0.7500000
## 28   Affect PD-Color YB 0.8181818
## 29      Affect PD-Noise 0.2000000
## 30      Affect PD-Pitch 0.4864865
## 31      Affect PD-Shape 0.2413793
## 32       Affect PD-Size 0.7931034
## 33      Affect PD-Speed 0.6666667
## 34        Affect SC-Amp 0.9811321
## 35 Affect SC-Brightness 0.7317073
## 36   Affect SC-Color RB 1.0000000
## 37   Affect SC-Color RG 0.7142857
## 38   Affect SC-Color RY 0.8333333
## 39   Affect SC-Color YB 0.6923077
## 40      Affect SC-Noise 0.8918919
## 41      Affect SC-Pitch 0.5945946
## 42      Affect SC-Shape 0.9090909
## 43       Affect SC-Size 0.6226415
## 44      Affect SC-Speed 0.9387755
## 45       Amp-Brightness 0.9000000
## 46         Amp-Color RB 0.9687500
## 47         Amp-Color RG 0.5961538
## 48         Amp-Color RY 0.7187500
## 49         Amp-Color YB 0.9318182
## 50            Amp-Noise 0.4875000
## 51            Amp-Pitch 0.2743902
## 52            Amp-Shape 0.7560976
## 53             Amp-Size 0.9125000
## 54            Amp-Speed 0.9375000
## 55  Brightness-Color RB 0.5312500
## 56  Brightness-Color RG 0.2916667
## 57  Brightness-Color RY 0.3125000
## 58  Brightness-Color YB 0.8333333
## 59     Brightness-Noise 0.3062500
## 60     Brightness-Pitch 0.5731707
## 61     Brightness-Shape 0.5182927
## 62      Brightness-Size 0.6500000
## 63     Brightness-Speed 0.9125000
## 64       Color RB-Noise 0.6000000
## 65       Color RB-Pitch 0.5000000
## 66       Color RB-Shape 0.7000000
## 67        Color RB-Size 0.7500000
## 68       Color RB-Speed 0.7500000
## 69       Color RG-Noise 0.6730769
## 70       Color RG-Pitch 0.2692308
## 71       Color RG-Shape 0.7500000
## 72        Color RG-Size 0.4375000
## 73       Color RG-Speed 0.4464286
## 74       Color RY-Noise 0.5208333
## 75       Color RY-Pitch 0.4687500
## 76       Color RY-Shape 0.7750000
## 77        Color RY-Size 0.6750000
## 78       Color RY-Speed 0.4375000
## 79       Color YB-Noise 0.4250000
## 80       Color YB-Pitch 0.6000000
## 81       Color YB-Shape 0.7500000
## 82        Color YB-Size 0.6562500
## 83       Color YB-Speed 0.9722222
## 84          Noise-Pitch 0.6036585
## 85          Noise-Shape 0.7012195
## 86           Noise-Size 0.5000000
## 87          Noise-Speed 0.5750000
## 88          Pitch-Shape 0.6071429
## 89           Pitch-Size 0.2256098
## 90          Pitch-Speed 0.5670732
## 91           Shape-Size 0.5121951
## 92          Shape-Speed 0.8170732
## 93           Size-Speed 0.3437500
```

So we can look at that table of means- it's nice but not that exciting- what we instead want to do is look at a heatmap of our results - 


```r
CleanDataAgg <- aggregate(Response ~ DataSet + Inducer + Concurrent + Comparison,
                     data= cleandata, mean)

Domains <- sort(unique(CleanDataAgg$Inducer))
HighValues <- c("Excited/Bored", "Happy/Sad", "Pleased/Disgusted", "Stressed/Calm",
                "Loud/Quiet", "Bright/Dark", "Red/Blue", "Red/Green", "Red/Yellow",
                "Yellow/Blue", "Noisy/Tonal", "High Pitch/Low Pitch", "Jagged/Curvy", 
                "Large/Small", "Fast/Slow")

CleanDataAgg$Inducer2 <- mapvalues(CleanDataAgg$Inducer, from = Domains, to= HighValues)
CleanDataAgg$Concurrent2 <- mapvalues(CleanDataAgg$Concurrent, from = Domains, to= HighValues)

PilotDataAgg <- subset(CleanDataAgg, DataSet == "Pilot")

ggplot(data= PilotDataAgg, aes(x=Concurrent2, y=Inducer2, fill=Response)) +
  geom_tile(color = "white") +
  ggtitle("Biases - Pilot Data") +
  scale_fill_gradient2(low = "red", high = "blue", mid = "white", 
                       midpoint = 0.5, limit = c(0,1),
                       name="Direction and Strength of Associaton") +
  theme_classic()+ 
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))+
  coord_fixed() 
```

![](Descriptive_Statistics_in_R_files/figure-html/First Heatmap-1.png)<!-- -->

```r
FullDataAgg <- subset(CleanDataAgg, DataSet == "Simulated")

ggplot(data= FullDataAgg, aes(x=Concurrent2, y=Inducer2, fill=Response)) +
  geom_tile(color = "white") +
  ggtitle("Biases - Pilot Data") +
  scale_fill_gradient2(low = "red", high = "blue", mid = "white", 
                       midpoint = 0.5, limit = c(0,1),
                       name="Direction and Strength of Associaton") +
  theme_classic()+ 
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))+
  coord_fixed() 
```

![](Descriptive_Statistics_in_R_files/figure-html/First Heatmap-2.png)<!-- -->

So there are heatmaps- one for the Pilot Data and one for the Full Data - the first sensible thing to check is how well the two aligned with each other, which we can do by substracting the heatmaps


```r
DiffDataAgg <- FullDataAgg

DiffDataAgg$DataSet <- "Difference"

DiffDataAgg$Response <- abs(FullDataAgg$Response - PilotDataAgg$Response)

ggplot(data= DiffDataAgg, aes(x=Concurrent2, y=Inducer2, fill=Response)) +
  geom_tile(color = "white") +
  ggtitle("Biases - Mismatch Between Imputed and Actual Values") +
  scale_fill_gradient2(low = "white", high = "red", 
                       name="Mismatch") +
  theme_classic()+ 
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))+
  coord_fixed()
```

![](Descriptive_Statistics_in_R_files/figure-html/Subtracting the dataframe-1.png)<!-- -->


So we know how our data lines up with our pilot data, and we know the mean responses per cell- surprisingly these findings alone are basically the whole purpose of the experiment. But for some rigor, we want more than just means in cells- we want something that gives us an estimate of how strong biases are and how confident we are about our data.


To that end we are going to do a t-test for every one of our 93 comparisons against chance- because our data aren't normally distributed we want to use a nonparametic statistic- in this case a signed-ranks test.


```r
FullData <- summaryBy(Response ~ 
                       Subject + DataSet + Condition +
                       Inducer + Concurrent + Comparison,
                     data= data, Fun = c(mean))

library(powerAnalysis)
```

```
## Warning: package 'powerAnalysis' was built under R version 3.4.1
```

```r
comparisons <- sort(unique(FullData$Comparison))
pvals <- list()
zvals <- list()
statvals <- list()
rm(comparison)
```

```
## Warning in rm(comparison): object 'comparison' not found
```

```r
for(comparison in comparisons){
  testdata <- subset(FullData, Comparison == comparison)
  
  testres <- wilcox.test(testdata$Response, mu= 0.5, alternative = "two.sided")
  
  pval <- testres$p.value
  pvals <- c(pvals, pval)
  
  testZ <- qnorm(pval/2)
  zvals <- c(zvals, testZ)
  
  teststat <- abs(testZ / (sqrt(nrow(testdata))))
  statvals <- c(statvals, teststat)
  
}
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties

## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with ties
```

```
## Warning in wilcox.test.default(testdata$Response, mu = 0.5, alternative =
## "two.sided"): cannot compute exact p-value with zeroes
```

```r
FullDataAgg$pValue <- as.numeric(pvals)
FullDataAgg$ZValue <- as.numeric(zvals)
FullDataAgg$effsize <- as.numeric(statvals)

FullDataAgg$effsize <- ifelse(FullDataAgg$Response < 0.5,
                              FullDataAgg$effsize * -1,
                              FullDataAgg$effsize)

ggplot(data= FullDataAgg, aes(x=Concurrent2, y=Inducer2, fill=effsize)) +
  geom_tile(color = "white") +
  scale_fill_gradient2(low = "red", high = "blue", mid = "white", limit = c(-1,1),
                       name="Effect Size") +
  geom_text(aes(label = round(effsize, 2)), size = 2) +
  theme_classic()+ 
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))+
  coord_fixed() 
```

![](Descriptive_Statistics_in_R_files/figure-html/Wilcoxon-1.png)<!-- -->


So this is all of our effect sizes- some are obviously very small and some are very large - but we might want to only consider the ones that are significant- to do that we can subset the data or look at it in some other way 


```r
FullDataAgg$correctedP <- FullDataAgg$pValue * 93

FullDataAgg$effsize2 <- as.numeric(ifelse(FullDataAgg$correctedP > 0.05,
                               "NA",
                               FullDataAgg$effsize))
```

```
## Warning: NAs introduced by coercion
```

```r
ggplot(data= FullDataAgg, aes(x=Concurrent2, y=Inducer2, fill=effsize2)) +
  geom_tile(color = "white") +
  scale_fill_gradient2(low = "red", high = "blue", mid = "white", limit = c(-1,1),
                       name="Effect Size") +
  geom_text(aes(label = round(effsize, 2)), size = 2) +
  theme_classic()+ 
  theme(axis.text.x = element_text(angle = 45, vjust = 1, hjust = 1))+
  coord_fixed() 
```

![](Descriptive_Statistics_in_R_files/figure-html/Correcting p for multiple comparisons-1.png)<!-- -->




