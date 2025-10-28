from diagrams import Diagram, Cluster
from diagrams.aws.general import InternetAlt1
from diagrams.aws.network import Route53, CloudFront, APIGateway
from diagrams.aws.security import CertificateManager
from diagrams.aws.storage import S3
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb

with Diagram(
    "Cloud Resume Architecture",
    filename="cloud_resume_architecture",
    show=False,
    direction="LR",
    graph_attr={
        "splines": "ortho",
        "nodesep": "3.0",
        "ranksep": "3.0",
        "pad": "1.5",
        "fontsize": "16"
    }
  
):
    # User on the internet
    user = InternetAlt1("Visitor Browser")

    # DNS & SSL
    dns = Route53("Route 53\nDNS")
    cert = CertificateManager("ACM\nCertificate")

    with Cluster("Frontend"):
        cf = CloudFront("CloudFront\nCDN + HTTPS")
        s3 = S3("S3\nStatic Website")

    with Cluster("Backend"):
        api = APIGateway("API Gateway")
        lamb = Lambda("Lambda\nVisitor Counter")

    with Cluster("Data"):
        table1 = Dynamodb("VisitorCountTable")
        table2 = Dynamodb("VisitorIdsTable")

    # Connections
    user >> dns >> cf
    cert >> cf                # CloudFront uses ACM certificate
    cf >> [s3, api]           # CDN distributes static + API traffic
    api >> lamb >> [table1, table2]
