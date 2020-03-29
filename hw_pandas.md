
# Dependencies


```python
import pandas as pd
students_df = pd.read_csv('students_complete.csv')
schools_df = pd.read_csv('schools_complete.csv')
schools_df = schools_df.rename(columns={'name': 'school'})
```

# District Summary 


```python
schools = students_df['school'].value_counts().count()
student_names = students_df['name'].value_counts().count()
total_budget = schools_df['budget'].sum()
reading = students_df['reading_score'].mean()
math = students_df['math_score'].mean()

passing_math = students_df.query('math_score>=70').count()
math_score = ((passing_math['math_score'] / students_df['math_score'].count()) * 100).round(2)
passing_reading = students_df.query('reading_score>=70').count()
reading_score = ((passing_reading['reading_score'] / students_df['reading_score'].count()) * 100).round(2)
overall_pass = ((math_score + reading_score) / 2).round(2)

district_summary = pd.DataFrame({"Total Schools": [schools], 
                                 "Total Students": [student_names],
                                 "Total Budget": [total_budget],
                                 "Average Reading Score": [reading],
                                 "Average Math Score": [math],
                                 "% Passing Math": [math_score],
                                 "% Passing Reading": [reading_score],
                                 "% Overall Passing": [overall_pass],
                                })
district_summary
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>% Overall Passing</th>
      <th>% Passing Math</th>
      <th>% Passing Reading</th>
      <th>Average Math Score</th>
      <th>Average Reading Score</th>
      <th>Total Budget</th>
      <th>Total Schools</th>
      <th>Total Students</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>80.4</td>
      <td>74.98</td>
      <td>85.81</td>
      <td>78.985371</td>
      <td>81.87784</td>
      <td>24649428</td>
      <td>15</td>
      <td>32715</td>
    </tr>
  </tbody>
</table>
</div>



# School Summary


```python
name_school = schools_df[['school','type', 'budget']]

total_students = pd.DataFrame(students_df.groupby("school")["name"].count())
total_students.reset_index(inplace=True)
total_students.columns=[["school", "Total Students"]]

average_reading_scores = pd.DataFrame(students_df.groupby("school")["reading_score"].mean())
average_reading_scores.reset_index(inplace=True)
average_reading_scores.columns=[["school", "Average Reading Score"]]
average_reading_scores.head()

average_math_scores = pd.DataFrame(students_df.groupby("school")["math_score"].mean())
average_math_scores.reset_index(inplace=True)
average_math_scores.columns=[["school", "Average Math Score"]]

f_filtered = students_df[(students_df.reading_score >= 70)]
r_filtered = pd.DataFrame(f_filtered.groupby("school")["reading_score"].mean())
r_filtered.reset_index(inplace=True)
r_filtered.columns=[["school", "% Passing Reading"]]

mo_filtered = students_df[(students_df.math_score >= 70)]
m_filtered = pd.DataFrame(mo_filtered.groupby("school")["math_score"].mean())
m_filtered.reset_index(inplace=True)
m_filtered.columns=[["school", "% Passing Math"]]
m_filtered.head(5)

merged_df = pd.merge(name_school, total_students, on="school").merge(average_math_scores,on='school').merge(average_reading_scores, on='school').merge(r_filtered, on='school').merge(m_filtered, on='school')
merged_df["Budget Per Student"] = merged_df["budget"] / merged_df["Total Students"]
merged_df["Overall Passing"] = ((merged_df["% Passing Reading"] + merged_df["% Passing Math"]) / 2).round(2)
merged_df = merged_df.iloc[:,[0,1,3,2,8,5,4,6,7,9]]
new = merged_df.rename(columns={'school': 'School','type':'School Type','budget':'Total School Budget','Budget Per Student':'Per Student Budget','Overall Passing':'% Overall Passing Rate'})
new.set_index('School', inplace=True)
new.sort_index(inplace=True)
del new.index.name
new.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total School Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>% Overall Passing Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Bailey High School</th>
      <td>District</td>
      <td>4976</td>
      <td>3124928</td>
      <td>628.0</td>
      <td>81.033963</td>
      <td>77.048432</td>
      <td>84.362521</td>
      <td>84.505124</td>
      <td>84.43</td>
    </tr>
    <tr>
      <th>Cabrera High School</th>
      <td>Charter</td>
      <td>1858</td>
      <td>1081356</td>
      <td>582.0</td>
      <td>83.975780</td>
      <td>83.061895</td>
      <td>84.432612</td>
      <td>83.972556</td>
      <td>84.20</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>District</td>
      <td>2949</td>
      <td>1884411</td>
      <td>639.0</td>
      <td>81.158020</td>
      <td>76.711767</td>
      <td>84.767745</td>
      <td>84.310894</td>
      <td>84.54</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>District</td>
      <td>2739</td>
      <td>1763916</td>
      <td>644.0</td>
      <td>80.746258</td>
      <td>77.102592</td>
      <td>84.612799</td>
      <td>84.165687</td>
      <td>84.39</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>Charter</td>
      <td>1468</td>
      <td>917500</td>
      <td>625.0</td>
      <td>83.816757</td>
      <td>83.351499</td>
      <td>84.253156</td>
      <td>84.394602</td>
      <td>84.32</td>
    </tr>
  </tbody>
</table>
</div>



# Top performing Schools (By Passing Rate)


```python
highest_passing = new.sort_values("% Overall Passing Rate", ascending=False)
highest_passing.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total School Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>% Overall Passing Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Holden High School</th>
      <td>Charter</td>
      <td>427</td>
      <td>248087</td>
      <td>581.0</td>
      <td>83.814988</td>
      <td>83.803279</td>
      <td>84.391727</td>
      <td>85.040506</td>
      <td>84.72</td>
    </tr>
    <tr>
      <th>Hernandez High School</th>
      <td>District</td>
      <td>4635</td>
      <td>3022020</td>
      <td>652.0</td>
      <td>80.934412</td>
      <td>77.289752</td>
      <td>84.483725</td>
      <td>84.936975</td>
      <td>84.71</td>
    </tr>
    <tr>
      <th>Pena High School</th>
      <td>Charter</td>
      <td>962</td>
      <td>585858</td>
      <td>609.0</td>
      <td>84.044699</td>
      <td>83.839917</td>
      <td>84.680390</td>
      <td>84.719780</td>
      <td>84.70</td>
    </tr>
    <tr>
      <th>Wright High School</th>
      <td>Charter</td>
      <td>1800</td>
      <td>1049400</td>
      <td>583.0</td>
      <td>83.955000</td>
      <td>83.682222</td>
      <td>84.479586</td>
      <td>84.758929</td>
      <td>84.62</td>
    </tr>
    <tr>
      <th>Johnson High School</th>
      <td>District</td>
      <td>4761</td>
      <td>3094650</td>
      <td>650.0</td>
      <td>80.966394</td>
      <td>77.072464</td>
      <td>84.430566</td>
      <td>84.742448</td>
      <td>84.59</td>
    </tr>
  </tbody>
</table>
</div>



# Bottom Performing Schools (By Passing Rate)


```python
lowest_passing = new.sort_values("% Overall Passing Rate")
lowest_passing.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total School Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>% Overall Passing Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Cabrera High School</th>
      <td>Charter</td>
      <td>1858</td>
      <td>1081356</td>
      <td>582.0</td>
      <td>83.975780</td>
      <td>83.061895</td>
      <td>84.432612</td>
      <td>83.972556</td>
      <td>84.20</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>Charter</td>
      <td>1468</td>
      <td>917500</td>
      <td>625.0</td>
      <td>83.816757</td>
      <td>83.351499</td>
      <td>84.253156</td>
      <td>84.394602</td>
      <td>84.32</td>
    </tr>
    <tr>
      <th>Shelton High School</th>
      <td>Charter</td>
      <td>1761</td>
      <td>1056600</td>
      <td>600.0</td>
      <td>83.725724</td>
      <td>83.359455</td>
      <td>84.362559</td>
      <td>84.326679</td>
      <td>84.34</td>
    </tr>
    <tr>
      <th>Rodriguez High School</th>
      <td>District</td>
      <td>3999</td>
      <td>2547363</td>
      <td>637.0</td>
      <td>80.744686</td>
      <td>76.842711</td>
      <td>84.374377</td>
      <td>84.339111</td>
      <td>84.36</td>
    </tr>
    <tr>
      <th>Thomas High School</th>
      <td>Charter</td>
      <td>1635</td>
      <td>1043130</td>
      <td>638.0</td>
      <td>83.848930</td>
      <td>83.418349</td>
      <td>84.259585</td>
      <td>84.497705</td>
      <td>84.38</td>
    </tr>
  </tbody>
</table>
</div>



# Math Scores by Grade


```python
schoolgrouped_df = schools_df[['school']]

math_grade_df = students_df[['grade', 'school', 'math_score']]

m_grade_9th = math_grade_df.loc[math_grade_df["grade"] == "9th"]
m_ren_9 = m_grade_9th.rename(columns={'math_score': '9th'})
del m_ren_9['grade']
m_group_ren_9 = m_ren_9.groupby("school")["9th"].mean()

m_grade_10th = math_grade_df.loc[math_grade_df["grade"] == "10th"]
m_ren_10 = m_grade_10th.rename(columns={'math_score': '10th'})
del m_ren_10['grade']
m_group_ren_10 = m_ren_10.groupby("school")["10th"].mean()

m_grade_11th = math_grade_df.loc[math_grade_df["grade"] == "11th"]
m_ren_11 = m_grade_11th.rename(columns={'math_score': '11th'})
del m_ren_11['grade']
m_group_ren_11 = m_ren_11.groupby("school")["11th"].mean()

m_grade_12th = math_grade_df.loc[math_grade_df["grade"] == "12th"]
m_ren_12 = m_grade_12th.rename(columns={'math_score': '12th'})
del m_ren_12['grade']
m_group_ren_12 = m_ren_12.groupby("school")["12th"].mean()

m_grade_9th_merged = pd.DataFrame.join(schoolgrouped_df, m_group_ren_9, on="school")
m_grade_10th_merged = pd.DataFrame.join(m_grade_9th_merged, m_group_ren_10, on="school")
m_grade_11th_merged = pd.DataFrame.join(m_grade_10th_merged, m_group_ren_11, on="school")
m_grade_12th_merged = pd.DataFrame.join(m_grade_11th_merged, m_group_ren_12, on="school")
m_grade_12th_merged.set_index('school', inplace=True)
m_grade_12th_merged.sort_index(inplace=True)
del m_grade_12th_merged.index.name
m_grade_12th_merged.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>9th</th>
      <th>10th</th>
      <th>11th</th>
      <th>12th</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Bailey High School</th>
      <td>77.083676</td>
      <td>76.996772</td>
      <td>77.515588</td>
      <td>76.492218</td>
    </tr>
    <tr>
      <th>Cabrera High School</th>
      <td>83.094697</td>
      <td>83.154506</td>
      <td>82.765560</td>
      <td>83.277487</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>76.403037</td>
      <td>76.539974</td>
      <td>76.884344</td>
      <td>77.151369</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>77.361345</td>
      <td>77.672316</td>
      <td>76.918058</td>
      <td>76.179963</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>82.044010</td>
      <td>84.229064</td>
      <td>83.842105</td>
      <td>83.356164</td>
    </tr>
  </tbody>
</table>
</div>



# Reading Score by Grade


```python
grade_df = students_df[['grade', 'school', 'reading_score']]

grade_9th = grade_df.loc[grade_df["grade"] == "9th"]
ren_9 = grade_9th.rename(columns={'reading_score': '9th'})
del ren_9['grade']
group_ren_9 = ren_9.groupby("school")["9th"].mean()

grade_10th = grade_df.loc[grade_df["grade"] == "10th"]
ren_10 = grade_10th.rename(columns={'reading_score': '10th'})
del ren_10['grade']
group_ren_10 = ren_10.groupby("school")["10th"].mean()

grade_11th = grade_df.loc[grade_df["grade"] == "11th"]
ren_11 = grade_11th.rename(columns={'reading_score': '11th'})
del ren_11['grade']
group_ren_11 = ren_11.groupby("school")["11th"].mean()

grade_12th = grade_df.loc[grade_df["grade"] == "12th"]
ren_12 = grade_12th.rename(columns={'reading_score': '12th'})
del ren_12['grade']
group_ren_12 = ren_12.groupby("school")["12th"].mean()

grade_9th_merged = pd.DataFrame.join(schoolgrouped_df, group_ren_9, on="school")
grade_10th_merged = pd.DataFrame.join(grade_9th_merged, group_ren_10, on="school")
grade_11th_merged = pd.DataFrame.join(grade_10th_merged, group_ren_11, on="school")
grade_12th_merged = pd.DataFrame.join(grade_11th_merged, group_ren_12, on="school")
grade_12th_merged.set_index('school', inplace=True)
grade_12th_merged.sort_index(inplace=True)
del grade_12th_merged.index.name
grade_12th_merged.head(5)
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>9th</th>
      <th>10th</th>
      <th>11th</th>
      <th>12th</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Bailey High School</th>
      <td>81.303155</td>
      <td>80.907183</td>
      <td>80.945643</td>
      <td>80.912451</td>
    </tr>
    <tr>
      <th>Cabrera High School</th>
      <td>83.676136</td>
      <td>84.253219</td>
      <td>83.788382</td>
      <td>84.287958</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>81.198598</td>
      <td>81.408912</td>
      <td>80.640339</td>
      <td>81.384863</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>80.632653</td>
      <td>81.262712</td>
      <td>80.403642</td>
      <td>80.662338</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>83.369193</td>
      <td>83.706897</td>
      <td>84.288089</td>
      <td>84.013699</td>
    </tr>
  </tbody>
</table>
</div>



# Scores by School Spending


```python
sony_df = pd.merge(name_school, total_students, on="school").merge(average_math_scores,on='school').merge(average_reading_scores, on='school').merge(r_filtered, on='school').merge(m_filtered, on='school')
sony_df["Budget Per Student"] = sony_df["budget"] / sony_df["Total Students"]
sony_df["Overall Passing"] = ((sony_df["% Passing Reading"] + sony_df["% Passing Math"]) / 2).round(2)
bins = [0, 585, 615, 645, 675]
group_names = ['<$585', '$585-615', '$615-645', '$645-675']
sony_df["Spending Ranges Per Student"] = pd.cut(sony_df["Budget Per Student"],bins,labels=group_names)
sony_group = sony_df.groupby("Spending Ranges Per Student").mean()
del sony_group['budget']
del sony_group['Total Students']
del sony_group['Budget Per Student']
sony_group.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Average Math Score</th>
      <th>Average Reading Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing</th>
    </tr>
    <tr>
      <th>Spending Ranges Per Student</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>&lt;$585</th>
      <td>83.455399</td>
      <td>83.933814</td>
      <td>84.457674</td>
      <td>84.504010</td>
      <td>84.482500</td>
    </tr>
    <tr>
      <th>$585-615</th>
      <td>83.599686</td>
      <td>83.885211</td>
      <td>84.521475</td>
      <td>84.523229</td>
      <td>84.520000</td>
    </tr>
    <tr>
      <th>$615-645</th>
      <td>79.079225</td>
      <td>81.891436</td>
      <td>84.438364</td>
      <td>84.368854</td>
      <td>84.403333</td>
    </tr>
    <tr>
      <th>$645-675</th>
      <td>76.997210</td>
      <td>81.027843</td>
      <td>84.535230</td>
      <td>84.639836</td>
      <td>84.590000</td>
    </tr>
  </tbody>
</table>
</div>



# Scores by School Size


```python
name2_school = schools_df[['school','type', 'size']]
sony2_df = pd.merge(name2_school, total_students, on="school").merge(average_math_scores,on='school').merge(average_reading_scores, on='school').merge(r_filtered, on='school').merge(m_filtered, on='school')
sony2_df["Overall Passing"] = ((sony2_df["% Passing Reading"] + sony2_df["% Passing Math"]) / 2).round(2)
bins2 = [0, 1000, 2000, 5000]
group_names2 = ['Small(<1000)', 'Medium(1000-2000)','Large(2000-5000)']
sony2_df["School Size"] = pd.cut(sony2_df["Total Students"],bins2,labels=group_names2)
sony2_group = sony2_df.groupby("School Size").mean()
del sony2_group['size']
sony2_group.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Total Students</th>
      <th>Average Math Score</th>
      <th>Average Reading Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing</th>
    </tr>
    <tr>
      <th>School Size</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Small(&lt;1000)</th>
      <td>694.500</td>
      <td>83.821598</td>
      <td>83.929843</td>
      <td>84.536059</td>
      <td>84.880143</td>
      <td>84.710</td>
    </tr>
    <tr>
      <th>Medium(1000-2000)</th>
      <td>1704.400</td>
      <td>83.374684</td>
      <td>83.864438</td>
      <td>84.357500</td>
      <td>84.390094</td>
      <td>84.372</td>
    </tr>
    <tr>
      <th>Large(2000-5000)</th>
      <td>3657.375</td>
      <td>77.746417</td>
      <td>81.344493</td>
      <td>84.531238</td>
      <td>84.435547</td>
      <td>84.485</td>
    </tr>
  </tbody>
</table>
</div>



# Scores by School Type


```python
name3_school = schools_df[['school','type', 'size']]
sony3_df = pd.merge(name2_school, total_students, on="school").merge(average_math_scores,on='school').merge(average_reading_scores, on='school').merge(r_filtered, on='school').merge(m_filtered, on='school')
sony3_df["Overall Passing"] = ((sony3_df["% Passing Reading"] + sony3_df["% Passing Math"]) / 2).round(2)
sony3_group = sony3_df.groupby("type").mean()
sony3_group.index.names = ['School Type']
sony3_group.head()
```




<div>
<style>
    .dataframe thead tr:only-child th {
        text-align: right;
    }

    .dataframe thead th {
        text-align: left;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>size</th>
      <th>Total Students</th>
      <th>Average Math Score</th>
      <th>Average Reading Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing</th>
    </tr>
    <tr>
      <th>School Type</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Charter</th>
      <td>1524.250000</td>
      <td>1524.250000</td>
      <td>83.473852</td>
      <td>83.896421</td>
      <td>84.423298</td>
      <td>84.494351</td>
      <td>84.458750</td>
    </tr>
    <tr>
      <th>District</th>
      <td>3853.714286</td>
      <td>3853.714286</td>
      <td>76.956733</td>
      <td>80.966636</td>
      <td>84.531876</td>
      <td>84.462903</td>
      <td>84.498571</td>
    </tr>
  </tbody>
</table>
</div>


