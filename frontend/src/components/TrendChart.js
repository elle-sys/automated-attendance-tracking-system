import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const TrendChart = ({ data, title, width: customWidth, height: customHeight }) => {
  // Ensure data values are numbers
  const chartData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(value => Number(value) || 0)
    }))
  };

  const chartWidth = customWidth || Dimensions.get('window').width - 32;
  const chartHeight = customHeight || 220;

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={chartWidth - 30}  // Account for container padding
        height={chartHeight}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#cfcfcf',
          backgroundGradientFrom: '#cfcfcf',
          backgroundGradientTo: '#706c6c',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(242, 242, 5, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fff',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    backgroundColor: '#9c9898',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default TrendChart; 