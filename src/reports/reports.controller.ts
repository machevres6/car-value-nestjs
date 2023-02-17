import { 
    Controller, 
    Post, 
    Body, 
    UseGuards,
    Patch, 
    Get,
    Query,
    Param
} from '@nestjs/common';
import {
    ApproveReportDto,
    CreateReportDto,
    ReportDto,
    GetEstimateDto,
} from './dtos';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AdminGuard } from '../guards/admin.guard';


@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto,
                 @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    approveReport(
        @Param('id') id: string,
        @Body() body: ApproveReportDto,
    ) {
        return this.reportsService.changeApproval(id, body.approved);
    }

    @Get()
    getEstimate(
        @Query() query: GetEstimateDto,
    ) {
        return this.reportsService.createEstimate(query);
    }
}
