import os
import csv

print("Financial Analysis")
print("-------------------")

with open('budget_data_1.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    next(csvreader)
    monthdata = list(csvreader)
    total_months = len(monthdata)
    print("Total Months: " + str(total_months))

with open('budget_data_1.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    for row in csvreader:
        total_revenue = 0
        for row in csv.reader(csvfile):
            total_revenue += int(row[1])
        print("Total Revenue: $" + str(total_revenue))
    print("Average Revenue Change: $" + str(int(total_revenue/total_months)))

with open('budget_data_1.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')
    next(csvreader)
    all_data = ([float(row[1]) for row in csvreader])
    test = ([next - curr for next, curr in zip(all_data[1:], all_data[: -1])])
    maxtest = max(test)
    mintest = min(test)
    print("Greatest Increase in Revenue: $" + (" (") + (str(int(maxtest))) + (")"))
    print("Greatest Decrease in Revenue: $" + (" (") + (str(int(mintest))) + (")"))