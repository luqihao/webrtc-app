import React, { useRef, useEffect, useState } from 'react'
import { desktopCapturer } from 'electron'
import { Button } from 'antd'
import styles from './index.module.scss'

const VIDEO_WIDTH = 500
const VIDEO_HEIGHT = 400

const WebRTC: React.FC = () => {
    const monitor = useRef<HTMLCanvasElement>(null)
    const monitorVideo = useRef<HTMLVideoElement>(null)

    const recorder = useRef<HTMLCanvasElement>(null)
    const recorderVideo = useRef<HTMLVideoElement>(null)

    const [monitorVisible, setMonitorVisible] = useState<boolean>(false)
    const [recorderVisible, setRecorderVisible] = useState<boolean>(false)

    useEffect(() => {
        if (monitorVisible && monitor.current && monitorVideo.current) {
            initMonitor()
        }
    }, [monitorVisible])

    useEffect(() => {
        if (recorderVisible && recorder.current && recorderVideo.current) {
            initRecorder()
        }
    }, [recorderVisible])

    const initMonitor = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        monitorVideo.current.srcObject = mediaStream
        monitorVideo.current.onloadedmetadata = () => {
            monitorVideo.current.play()
        }
        monitorDrawToCanvas()
    }

    const monitorDrawToCanvas = () => {
        const ctx = monitor.current.getContext('2d')
        ctx.drawImage(monitorVideo.current, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
        requestAnimationFrame(monitorDrawToCanvas)
    }

    const initRecorder = async () => {
        desktopCapturer.getSources({ types: ['screen'] }).then(async (sources: any[]) => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sources[0].id,
                            minWidth: VIDEO_WIDTH,
                            maxWidth: VIDEO_WIDTH,
                            minHeight: VIDEO_HEIGHT,
                            maxHeight: VIDEO_HEIGHT
                        }
                    } as MediaTrackConstraints
                })
                recorderVideo.current.srcObject = mediaStream
                recorderVideo.current.onloadedmetadata = () => {
                    recorderVideo.current.play()
                }
                RecorderDrawToCanvas()
            } catch (e) {
                console.error(e)
            }
        })
    }

    const RecorderDrawToCanvas = () => {
        const ctx = recorder.current.getContext('2d')
        ctx.drawImage(recorderVideo.current, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT)
        requestAnimationFrame(RecorderDrawToCanvas)
    }

    return (
        <div>
            <div id="mediaWrapper" className={styles.mediaWrapper}>
                <canvas
                    width={VIDEO_WIDTH}
                    height={VIDEO_HEIGHT}
                    id="monitor"
                    ref={monitor}
                    style={{ background: 'lightgreen' }}
                />
                <canvas
                    width={VIDEO_WIDTH}
                    height={VIDEO_HEIGHT}
                    id="recorder"
                    ref={recorder}
                    style={{ background: 'lightskyblue' }}
                />

                <video
                    id="monitorVideo"
                    ref={monitorVideo}
                    className={styles.video}
                    autoPlay={false}
                    width={VIDEO_WIDTH}
                    height={VIDEO_HEIGHT}
                />
                <video
                    id="recorderVideo"
                    ref={recorderVideo}
                    className={styles.video}
                    autoPlay={false}
                    width={VIDEO_WIDTH}
                    height={VIDEO_HEIGHT}
                />
            </div>
            <div className={styles.btnWrapper}>
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            setMonitorVisible(true)
                        }}
                    >
                        开启摄像头
                    </Button>
                </div>
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            setRecorderVisible(true)
                        }}
                    >
                        录制屏幕
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WebRTC
