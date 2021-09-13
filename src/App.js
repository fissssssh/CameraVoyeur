import "./App.css";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Dialog,
} from "@material-ui/core";
import { LinearProgressWithLabel } from "./components/LinearProgressWithLabel";
import { useSnackbar } from "notistack";

const useStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
    paddingTop: theme.spacing(2),
  },
  progress: {
    width: "100vw",
  },
  tips: {
    textAlign: "center",
  },
  previewCard: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  previewVideo: {
    width: "100%",
  },
}));
function App() {
  const classes = useStyle();
  const [IP, setIP] = useState("");
  const [isHacking, setIsHacking] = useState(false);
  const [x, setX] = useState(0);
  const [tips, setTips] = useState("正在初始化");
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [showWarning, setShowWarning] = React.useState(false);
  const progressRef = React.useRef(() => {});
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    const k = 5;
    function getProgress(x) {
      var y = (100 * (x - k * Math.sqrt(x))) / (x - k * k);
      if (y >= 100) {
        y = 100;
      }
      return y;
    }
    function getDetails(progress) {
      if (progress >= 100) return "黑入成功";
      else if (progress >= 99.101) return "正在加载视频预览";
      else if (progress >= 98.012) return "正在开启对方的摄像头";
      else if (progress >= 97.321) return "正在开启远程主机的权限";
      else if (progress >= 91.987) return "正在尝试登入系统并安装远程操控驱动";
      else if (progress >= 75.129) return "正在暴力破解对方的密码，这可能会花费一段时间";
      else if (progress >= 70.583) return "正在搜索合适的密码破解算法";
      else if (progress >= 64.257) return "正在扫描对方的漏洞";
      else if (progress >= 61.234) return "正在验证系统版本";
      else if (progress >= 55.123) return "正在建立网络连接";
      else return "正在初始化";
    }
    function getNextProgress(progress) {
      if (progress >= 100) return 100;
      else if (progress >= 99.101) return 100;
      else if (progress >= 98.012) return 99.101;
      else if (progress >= 97.321) return 98.012;
      else if (progress >= 91.987) return 97.321;
      else if (progress >= 75.129) return 91.987;
      else if (progress >= 70.583) return 75.129;
      else if (progress >= 64.257) return 70.583;
      else if (progress >= 61.234) return 64.257;
      else if (progress >= 55.123) return 61.234;
      else return 55.123;
    }
    progressRef.current = () => {
      if (progress > 100) {
        return;
      }
      const newX = x + Math.random() * 100000;
      setProgress(getProgress(newX));
      setBuffer(getNextProgress(progress));
      setX(newX);
      setTips(getDetails(progress));
    };
  });

  React.useEffect(() => {
    if (isHacking) {
      window.onbeforeunload = (e) => {};
      enqueueSnackbar("开始骇入！", { variant: "success" });
      const timer = setInterval(() => {
        progressRef.current();
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isHacking, enqueueSnackbar]);
  function btnHackClickHandler(e) {
    if (!validateIPv4(IP)) {
      enqueueSnackbar("IP地址格式不正确！！！", { variant: "error" });
      return;
    }
    setShowWarning(true);
  }

  function validateIPv4(ip) {
    ip = ip || "";
    ip = ip.trim();
    if (ip === "") return false;
    const splitValues = ip.split(".");
    if (splitValues.length !== 4) {
      return false;
    }
    if (splitValues[0] === "127" || splitValues[0] === "0") {
      return false;
    }
    let result = true;
    splitValues.forEach((item) => (result &= item >= 0 && item <= 255));
    return result;
  }

  const warning = (
    <Dialog open={showWarning}>
      <Card>
        <CardHeader title="摄像头黑入器"></CardHeader>
        <CardContent>
          <Typography variant="body1">即将开始黑入远程主机：</Typography>
          <Typography variant="h5">{IP}</Typography>
          <Typography variant="body2" color="error">
            警告：利用系统漏洞黑入对方摄像头是违法行为，可能会被追踪法律责任！
            <br />
            由此产生的一切责任与开发者无关！
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              setIsHacking(true);
              setShowWarning(false);
            }}
            color="primary"
          >
            确定
          </Button>
          <Button onClick={() => setShowWarning(false)}>取消</Button>
        </CardActions>
      </Card>
    </Dialog>
  );
  return (
    <Container className={classes.root}>
      {warning}
      <Card>
        <CardHeader title={<Typography variant="h3">摄像头黑入器</Typography>}></CardHeader>
        <CardContent>
          <Grid container>
            <Grid xs={12} item>
              {isHacking ? (
                <LinearProgressWithLabel variant="buffer" value={progress} valueBuffer={buffer} />
              ) : (
                <TextField
                  fullWidth
                  placeholder="输入对方IP地址"
                  label="IP"
                  value={IP}
                  onChange={(e) => setIP(e.target.value)}
                />
              )}
            </Grid>
            {isHacking && (
              <Grid item xs={12} className={classes.tips}>
                {tips}
                <br />
                请勿关闭浏览器……
              </Grid>
            )}
          </Grid>
        </CardContent>
        {!isHacking && (
          <CardActions>
            <Button variant="contained" color="primary" onClick={btnHackClickHandler}>
              黑入对方
            </Button>
          </CardActions>
        )}
      </Card>
      {progress >= 99.101 && (
        <Card className={classes.previewCard}>
          <CardContent>
            {progress >= 100 ? (
              <img src="assets/sc2.jpg" alt="funny mad pee!" />
            ) : (
              <Box>
                <CircularProgress />
                <Typography variant="h6">画面加载中</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
