'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [plans, setPlans] = useState<any[]>([])
  const [age, setAge] = useState(30)
  const [deductible, setDeductible] = useState(0)
  const [sortedPlans, setSortedPlans] = useState<any[]>([])

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    const { data } = await supabase.from('vhis_plans').select('*')
    setPlans(data || [])
    sortPlans(data || [], age, deductible)
  }

  const sortPlans = (data: any[], userAge: number, ded: number) => {
    let premiumKey = 'premium_age_30'
    if (userAge >= 40) premiumKey = 'premium_age_40'
    else if (userAge >= 50) premiumKey = 'premium_age_50'
    else if (userAge >= 60) premiumKey = 'premium_age_60'

    const filtered = data.filter(p => p.deductible_options?.includes(ded))
    const sorted = filtered.sort((a, b) => (a[premiumKey] || 0) - (b[premiumKey] || 0))
    setSortedPlans(sorted)
  }

  const handleCalculate = () => {
    sortPlans(plans, age, deductible)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">VHISRich.com</h1>
        <p className="text-xl text-center text-gray-600 mb-12">香港自願醫保比較 + 稅務扣減計算器 (2025 更新)</p>

        {/* Calculator */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">快速計算每月保費</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">年齡</label>
              <select value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300">
                <option value={30}>30歲</option>
                <option value={40}>40歲</option>
                <option value={50}>50歲</option>
                <option value={60}>60歲</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">扣除額</label>
              <select value={deductible} onChange={(e) => setDeductible(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300">
                <option value={0}>$0</option>
                <option value={10000}>$10,000</option>
                <option value={20000}>$20,000</option>
              </select>
            </div>
            <button onClick={handleCalculate} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">計算</button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公司</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">計劃</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年限額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">每月保費 ({age}歲, 扣${deductible})</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.plan_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.plan_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${plan.annual_limit.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${plan[`premium_age_${age}`] || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href={plan.apply_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">申請</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedPlans.length === 0 && <p className="text-center py-8 text-gray-500">無符合計劃 — 試下調整年齡或扣除額。</p>}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">最後更新: {new Date().toLocaleDateString('zh-HK')}</p>
      </div>
    </div>
  )
}
