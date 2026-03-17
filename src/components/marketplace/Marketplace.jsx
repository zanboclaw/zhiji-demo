import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Star, Cpu, X, Play, Check } from 'lucide-react'
import { useMarketplaceStore } from '../../store'
import { skillsData, categories } from '../../data/mock'
import { Card, Button, StatusBadge } from '../ui'

export function Marketplace() {
  const {
    selectedCategory,
    selectedSort,
    searchQuery,
    installedSkills,
    setSelectedCategory,
    setSearchQuery,
    installSkill,
  } = useMarketplaceStore()

  const [selectedSkill, setSelectedSkill] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const filteredSkills = skillsData.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDownload = (skillId) => {
    setDownloadingId(skillId)
    setTimeout(() => {
      installSkill(skillId)
      setDownloadingId(null)
    }, 1500)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题区 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">机器人AI 技能市场</h1>
          <p className="text-gray-400">
            为机器人提供丰富的预训练技能，支持下载、集成、测试与快速部署
          </p>
        </div>

        {/* 搜索与筛选 */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* 分类标签 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 技能卡片列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const isInstalled = installedSkills.includes(skill.id)
            const isDownloading = downloadingId === skill.id

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 h-full flex flex-col hover" hover>
                  {/* 头部 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-primary" />
                    </div>
                    {isInstalled ? (
                      <StatusBadge status="normal">已安装</StatusBadge>
                    ) : (
                      <span className="text-xs text-gray-500">{skill.downloads.toLocaleString()} 下载</span>
                    )}
                  </div>

                  {/* 内容 */}
                  <h3 className="text-lg font-semibold text-white mb-1">{skill.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-1">{skill.description}</p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skill.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 底部 */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-status-warning fill-status-warning" />
                      <span className="text-sm text-white">{skill.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSkill(skill)}
                      >
                        详情
                      </Button>
                      <Button
                        variant={isInstalled ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => !isInstalled && handleDownload(skill.id)}
                        disabled={isInstalled || isDownloading}
                      >
                        {isDownloading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Download className="w-4 h-4" />
                          </motion.div>
                        ) : isInstalled ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            已安装
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* 技能详情弹层 */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="p-6">
                  {/* 头部 */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedSkill.name}</h2>
                        <p className="text-gray-400">版本 {selectedSkill.version} · {selectedSkill.author}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* 内容 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">核心能力</h3>
                      <p className="text-gray-400">{selectedSkill.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-2">输入</h3>
                        <ul className="space-y-1">
                          {selectedSkill.inputs.map((input) => (
                            <li key={input} className="text-sm text-gray-400">• {input}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-2">输出</h3>
                        <ul className="space-y-1">
                          {selectedSkill.outputs.map((output) => (
                            <li key={output} className="text-sm text-gray-400">• {output}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">适用场景</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkill.scenes.map((scene) => (
                          <span
                            key={scene}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                          >
                            {scene}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">模拟演示</h3>
                      <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border border-white/10">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                          <span className="text-gray-400 text-sm">点击播放演示视频</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 底部按钮 */}
                  <div className="flex space-x-3 mt-6 pt-6 border-t border-white/10">
                    <Button variant="primary" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      下载技能
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      仿真测试
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
