import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryInfo } from '../utils/constants';

const CategoryChart = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const chartData = data.map((item) => {
        const category = getCategoryInfo(item.category);
        return {
            name: category.label,
            value: parseFloat(item.amount),
            color: category.color,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) =>
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(value)
                    }
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryChart;
