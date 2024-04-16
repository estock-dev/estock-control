import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { Layout } from 'antd';
import './Layout.css';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

export default function MyLayout() {

    return (
        <>
            <Layout>
                <Header>
                    <NavBar />
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64, display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </>
    );
}
